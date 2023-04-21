const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../constants/constant")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const piggyBank = await deploy("PiggyBank", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("________________________________")
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(piggyBank.address, [])
    }
}
module.exports.tags = ["all"]

/**
 * @NOTE
 * HAD AN ISSUE WHEN I STARTED MY SOLIDITY FILE NAMING WITH SMALL LETTERS,MY DEPLOY FUNC COULDN'T SEE IT
 */
