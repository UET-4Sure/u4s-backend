import { ipfsService } from './ipfsService';
import { testIPFS } from './ipfsService';

const verifyIpfs = async (tokenURI: string) => {
  console.log('\n=== Verifying uploaded data ===');

  // Read and verify metadata
  console.log('\nReading metadata from IPFS...');
  const metadataData = await ipfsService.readFromIPFS(tokenURI);
  console.log('Metadata content:', JSON.stringify(metadataData, null, 2));

  const image = metadataData.image;

  // // Read and verify URL image
  // console.log("\nReading URL image from IPFS...");
  // const urlImageData = await ipfsService.readFromIPFS(urlImageUri);
  // console.log("URL image size:", urlImageData.byteLength, "bytes");
};

// Run test
async function runTest() {
  const tokenURI = await testIPFS();
  if (!tokenURI) {
    console.error('Failed to get tokenURI');
    return;
  }
  await verifyIpfs(tokenURI);
}

// runTest();
