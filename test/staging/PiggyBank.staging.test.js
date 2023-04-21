const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../constants/constant")

developmentChains.includes(network.name)
    ?
    describe.skip
    :
    describe("piggyBank", function () {
        let piggyBank
        let deployer
        const sendValue = ethers.utils.parseEther("1") //1000000000000000000 Gwei
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            piggyBank = await ethers.getContract("PiggyBank", deployer)
        })
        it("allows people to deposit and withdraw", async () => {
            await piggyBank.deposit({ value: sendValue })
            await piggyBank.withdraw()
            const endingBalance = await piggyBank.provider.getBalance(
                piggyBank.address
            )
            assert.equal(endingBalance.toString(), "0")
        })
    })