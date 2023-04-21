const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../constants/constant")

!developmentChains.includes(network.name)
    ?
    describe.skip
    :
    describe("piggyBank", function () {
        let piggyBank
        let deployer
        const sendValue = ethers.utils.parseEther("1") //1000000000000000000 Gwei
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"]) //helps us deploy all our contract containing all
            piggyBank = await ethers.getContract("PiggyBank", deployer)
        })
        // CONSTRUCTOR
        describe("constructor", async function () {
            it("checks if owner is set properly", async () => {
                const response = await piggyBank.getOwner()
                assert.equal(response, deployer)
            })
        })
        // DEPOSIT
        describe("deposit", async () => {
            it("it deposits ETH to the contract owner", async () => {
                await piggyBank.deposit({ value: sendValue })
                const response = await piggyBank.getDepositor(deployer)
                // assert.equal(response.toString(), sendValue.toString())
                await expect(piggyBank.deposit())
                    .to.emit(piggyBank, "Deposit")
            })
        })

        // WITHDRAW
        describe("withdraw", async () => {
            beforeEach(async function () {
                await piggyBank.deposit({ value: sendValue })
            }) //funds the contracts before running the its

            it("withdraw Eth from our contract", async () => {
                // Arrange
                const startingpiggyBankBalance =
                    await piggyBank.provider.getBalance(piggyBank.address)
                const startingDeployerBalance =
                    await piggyBank.provider.getBalance(deployer)
                // Act
                const transactionResponse = await piggyBank.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)

                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingpiggyBankBalance = await piggyBank.provider.getBalance(
                    piggyBank.address
                )

                const endingDeployerBalance =
                    await piggyBank.provider.getBalance(deployer)
                // Assert
                assert.equal(endingpiggyBankBalance, 0)
                assert.equal(
                    startingpiggyBankBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                )
                // WANTED TO ADD THIS BUT SEEMS LIKE ONCE THE SELFDESTRUCT GOES THROUGH , THE EVENT IS NOT OMMITED AGIAN
                // await expect(piggyBank.withdraw())
                // .to.emit(piggyBank, "Withdraw")
            })
        })
    })

/**
 * @NOTE
 * always rember to install this for your test
 * yarn add --dev hardhat @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
 * and remeber to downgrade your ethers to below 6. (seems like it has a malfunctioning)
 */

/**
 *    await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
 */