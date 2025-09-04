const {DECIMAL, INITIAL_ANSWER} = require("../helper-hardhat-config")
const {network} = require("hardhat")
module.exports = async ({getNamedAccounts, deployments}) => {

    if (network.name === "hardhat") {
        const {firstAccount} = await getNamedAccounts()
        const {deploy} = deployments;

        await deploy("MockV3Aggregator", { //部署的合约名字
            from: firstAccount,  //使用那个账户去部署
            args: [DECIMAL, INITIAL_ANSWER], //合约构造函数的参数
            log: true, //是否打印日志
        })
    } else {
        console.log("MockV3Aggregator skipped")
    }
}
//给这个task添加标签，这样在运行时，就可以指定运行这个task
module.exports.tags = ["all", "Mock"]