import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber, ContractReceipt } from "ethers"
import { deployments, ethers, network } from "hardhat"
import { text } from "stream/consumers"
import { deployArgs } from "../helper-hardhat-config"
import { Splitter } from "../typechain-types"
let {
    utils: { parseEther },
} = ethers
type SignerWithShare = {
    signer: SignerWithAddress
    share: number
}

describe("Splitter Test", () => {
    let splitter: Splitter
    let developer: SignerWithShare
    let artist: SignerWithShare
    let founder: SignerWithShare
    let accounts: SignerWithAddress[]
    let totalShares: BigNumber
    beforeEach(async () => {
        await deployments.fixture(["all"])
        splitter = await ethers.getContract("Splitter")
        accounts = await ethers.getSigners()
        let args = await deployArgs(network.config.chainId || 31337)
        developer = args!.developer
        artist = args!.artist
        founder = args!.founder
        totalShares = await splitter.totalShares()
    })
    it("sends Ether to contract evokes PaymentReceived event", async () => {
        await expect(
            developer.signer.sendTransaction({
                to: splitter.address,
                value: parseEther("100"),
            })
        )
            .to.emit(splitter, "PaymentReceived")
            .withArgs(developer.signer.address, parseEther("100"))
    })
    describe("Receiving Eth", () => {
        let balanceAmt: BigNumber
        beforeEach(async () => {
            let tx = await accounts[10].sendTransaction({
                to: splitter.address,
                value: parseEther("100"),
            })
            await tx.wait(1)
            balanceAmt = await ethers.provider.getBalance(splitter.address)
        })
        it("developer release eth", async () => {
            let balanceBefore = await ethers.provider.getBalance(
                developer.signer.address
            )
            let tx = await splitter["release(address)"](
                developer.signer.address
            )
            let res = await tx.wait(1)
            let transactionFee = res.effectiveGasPrice.mul(res.gasUsed)

            let balanceAfter = await ethers.provider.getBalance(
                developer.signer.address
            )
            let difference = balanceAfter.sub(balanceBefore)
            let diffrenceWithTxFee = difference.add(transactionFee)
            console.log(diffrenceWithTxFee.toString())
        })
    })
})
