import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { env as config } from '../config/index';

export interface SBTMetadata {
  name: string;
  description: string;
  image?: string; // IPFS URI (e.g., ipfs://<cid>)
  attributes: {
    kyc_status: string;
    issuer_id: string;
    validity_period: string;
    revoked: boolean;
    level: string;
  }[];
}

interface PinataResponse {
  IpfsHash: string;
}

export class IPFSService {
  private readonly pinataJwt: string;

  constructor() {
    const { pinataJwt } = config.pinata;
    if (!pinataJwt) {
      throw new Error('Pinata JWT is missing in config.pinata');
    }
    this.pinataJwt = pinataJwt;
  }

  /**
   * Uploads a local file to IPFS via Pinata and returns an ipfs:// CID URI.
   */
  async uploadImageFromFile(filePath: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await fetch(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.pinataJwt}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as PinataResponse;
      return `ipfs://${data.IpfsHash}`;
    } catch (err: any) {
      throw new Error(
        `uploadImageFromFile(${filePath}) failed: ${err.message}`,
      );
    }
  }

  /**
   * Downloads an image from a URL and uploads it to IPFS via Pinata, returning an ipfs:// URI.
   */
  async uploadImageFromUrl(imageUrl: string): Promise<string> {
    try {
      // Download image using axios
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      // Get content type from response headers
      const contentType = response.headers['content-type'];
      const extension = contentType.split('/')[1] || 'jpg'; // Default to jpg if can't determine

      // Create form data with the image
      const formData = new FormData();
      formData.append('file', Buffer.from(response.data), {
        filename: `image.${extension}`,
        contentType: contentType,
      });

      // Upload to Pinata
      const uploadResponse = await fetch(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.pinataJwt}`,
          },
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error(
          `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`,
        );
      }

      const data = (await uploadResponse.json()) as PinataResponse;
      return `ipfs://${data.IpfsHash}`;
    } catch (err: any) {
      throw new Error(`uploadImageFromUrl(${imageUrl}) failed: ${err.message}`);
    }
  }

  /**
   * Packs TokenMetadata as JSON, uploads to IPFS via Pinata, and returns the ipfs:// CID URI.
   */
  async createTokenURI(metadata: SBTMetadata): Promise<string> {
    try {
      if (!metadata.image) {
        metadata.image =
          'ipfs://QmbHoD9UJ1L2xfv5oFvhANsWzf1tMzN2Lr8YrPDACXt1aE';
      }
      const response = await fetch(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.pinataJwt}`,
          },
          body: JSON.stringify(metadata),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as PinataResponse;
      return `ipfs://${data.IpfsHash}`;
    } catch (err: any) {
      throw new Error(`createTokenURI failed: ${err.message}`);
    }
  }

  /**
   * Reads data from an IPFS URL using the public gateway
   */
  async readFromIPFS(ipfsUrl: string): Promise<any> {
    try {
      // Convert ipfs:// URL to public gateway URL
      const gatewayUrl = ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');

      const response = await fetch(gatewayUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if it's JSON or binary data
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else {
        // For binary data (like images), return the buffer
        return await response.arrayBuffer();
      }
    } catch (err: any) {
      throw new Error(`readFromIPFS(${ipfsUrl}) failed: ${err.message}`);
    }
  }
}

export const ipfsService = new IPFSService();

export async function uploadSBTMetadata() {
  const localImagePath = './assets/KYC.png';
  const localImageUri = await ipfsService.uploadImageFromFile(localImagePath);

  const metadata: SBTMetadata = {
    name: 'Identify Card',
    description: 'This is a KYC card used for identity verification',
    image: localImageUri,
    attributes: [
      {
        kyc_status: 'verified',
        issuer_id: 'vnpt',
        validity_period: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        revoked: false,
        level: 'personal',
      },
    ],
  };

  const tokenURI = await ipfsService.createTokenURI(metadata);
  console.log('Token URI created successfully tokenURI:', tokenURI);
  return tokenURI;
}

// TEST
export async function testIPFS() {
  const ipfsService = new IPFSService();

  try {
    // Test 1: Upload local image
    const tokenURI = await uploadSBTMetadata();
    return tokenURI;
  } catch (error) {
    console.error('Failed to create or verify token URI:', error);
  }
}
