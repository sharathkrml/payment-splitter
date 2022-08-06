import { ethers } from "hardhat"

const deployArgs = async (chainId: Number) => {
    if (chainId == 31337) {
        const accounts = await ethers.getSigners()
        return {
            developer: { signer: accounts[0], share: 30 },
            artist: { signer: accounts[1], share: 30 },
            founder: { signer: accounts[2], share: 40 },
        }
    }
}
export { deployArgs }
