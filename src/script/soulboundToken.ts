import { BigNumberish, ethers } from 'ethers';

import SBT_ABI from '../abi/IDentifySBT.json';
import { env as config } from '../config/index';
import { uploadSBTMetadata } from '../services/ipfsService';

const SBT_ADDRESS = '0xb117d1c006fC208FEAFFE5E08529BE5de8235B73';

export class SBTClient {
  private contract: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.contract = new ethers.Contract(SBT_ADDRESS, SBT_ABI.abi, signer);
  }

  async mint(params: { to: string; tokenURI: string }) {
    const tx = await this.contract.mint(params.to, params.tokenURI);
    const receipt = await tx.wait();

    return {
      receipt,
    };
  }

  async burn(params: { from: string }) {
    const tx = await this.contract.burn(params.from);
    const receipt = await tx.wait();
    return { receipt };
  }
}

const provider = new ethers.JsonRpcProvider(config.chain.rpc_url);
export const signer = new ethers.Wallet(config.private_key, provider);
export const sbtClient = new SBTClient(signer);

// TEST

async function testMint() {
  const tokenURI = await uploadSBTMetadata();
  const result = await sbtClient.mint({
    to: '0x2Bd7ff87647DFC43CFfE719D589e5eDcFFc751f1',
    tokenURI,
  });
  console.log('Minted successfully');
  return result;
}

async function testBurn() {
  const result = await sbtClient.burn({
    from: '0x2Bd7ff87647DFC43CFfE719D589e5eDcFFc751f1',
  });
  console.log('Burned successfully');
  return result;
}

async function test() {
  const mintResult = await testMint();
  const burnResult = await testBurn();
  return { mintResult, burnResult };
}

// test().then((result) => {
//   console.log(result);
// });
