const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
    const { deployer } = await getNamedAccounts()
    const piggyBank = await ethers.getContract("PiggyBank", deployer)
    console.log("Funding.....")
    const transactionResponse = await piggyBank.withdraw()
    await transactionResponse.wait(1)
    console.log("Got it back !")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
