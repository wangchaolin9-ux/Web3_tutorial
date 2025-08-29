require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config()//必须写config
require("@chainlink/env-enc").config() //这里使用加密的env-enc配置文件，这个会把.env.enc的内容保存在全局环境变量全局环境变量 process.env中，其他js就可以直接使用了
require("./tasks/index") //创建了task需要再这个配置文件中引入，才会生效
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat", //默认部署的网站就是本地的in-process网络,不写就是这个默认的，也可以修改默认的网络
    solidity: "0.8.28",
    networks: {
        sepolia: {
            //节点提供商有 Alchemy, Infura, Quicknode
            url: SEPOLIA_URL,
            accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
            chainId: 11155111
        }
    },
    etherscan: {//对合约进行验证需要配置ethscan的apikey 才能验证
        apiKey: {
            sepolia: ETHERSCAN_API_KEY
        }
    }
};
