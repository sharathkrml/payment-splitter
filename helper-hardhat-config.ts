import { ethers } from "hardhat";

const deployArgs = async (chainId: Number) => {
  if (chainId == 31337) {
    const accounts = await ethers.getSigners();
    return {
      developer: { address: accounts[0].address, share: 30 },
      artist: { address: accounts[1].address, share: 30 },
      founder: { address: accounts[2].address, share: 40 },
    };
  }
};
export { deployArgs };
