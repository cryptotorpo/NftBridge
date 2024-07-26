import * as preconfiguredChains from './chains';
import abi from './abi';
import erc20abi from '@/configs/erc20abi';
import {  bscTestnet } from '@wagmi/core/chains';
const contractAddress = {
  // [preconfiguredChains.default.sepolia.id]: '0x1C74526E4fe23d9f0d47e82745AaD8972614E8df',
  [preconfiguredChains.default.sepolia.id]: '0x481F3f5B73205e64e55177F1C86801d93AB22531',
  [preconfiguredChains.default.mainnet.id]: '0xd4e725297fa51b7fa20bb5a853744d96e194b726',
  [bscTestnet.id] : "0xD0fB0c583610b6e30cb876e73abb11348aDB7aC5"
};

const getContractAddress = (chainId: number) => {
  //@ts-ignore
  return contractAddress[chainId + ''];
}

export { preconfiguredChains, abi, erc20abi, getContractAddress };