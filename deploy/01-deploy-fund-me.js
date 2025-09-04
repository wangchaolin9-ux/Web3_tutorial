const {NETWORK_CONFIG, LOCK_TIME, CONFIRMATIONS} = require("../helper-hardhat-config")
const {network} = require("hardhat")
module.exports = async ({getNamedAccounts, deployments}) => {

    const {firstAccount} = await getNamedAccounts()
    const {deploy} = deployments;
    let dataFeedAddress;
    if (network.name === "hardhat") {
        const dataFeed = await deployments.get("MockV3Aggregator")
        dataFeedAddress = dataFeed.address
    } else {
        dataFeedAddress = NETWORK_CONFIG[network.config.chainId].ethUsdDataFeed
    }
    console.log("dataFeedAddress:", dataFeedAddress)
    let waitConfirmations = 0;
    if (network.name !== "hardhat") {
        waitConfirmations = CONFIRMATIONS;
    }
    const fundMe = await deploy("FundMe", { //部署的合约名字
        from: firstAccount,  //使用那个账户去部署
        args: [LOCK_TIME, dataFeedAddress], //合约构造函数的参数
        log: true, //是否打印日志,
        force:true,//强制重新部署，加了这个就不用写--reset了
        waitConfirmations: waitConfirmations//在hardhat deploy插件中使用这个方法等待5个区块，不能使用await fundMe.deploymentTransaction().wait(5)
    })

    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contract...")

        await hre.run("verify:verify", {
            address: fundMe.address,//使用hardhat deploy 插件部署所以需要使用.address 而不是.target.
            constructorArguments: [LOCK_TIME, dataFeedAddress],
        });
        console.log("Contract verified")
    } else {
        console.log("Not on sepolia network, skipping verification...")
    }
}
//给这个task添加标签，这样在运行时，就可以指定运行这个task
module.exports.tags = ["all", "FundMe"]