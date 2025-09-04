solidity 和hardhat学习
1、创建项目：
npm init
npm install -D hardhat@^2.26.3
npx hardhat 创建hardhat项目
2、安装依赖
npm install @chainlink/contracts --save
npm install --save-dev @openzeppelin/contracts

3、安装nodeJs
brew install nvm 然后根据提示创建工作目录和配置环境变量
nvm install 18 直接跟版本号就可以安装
uvm use 20 可以切换nodeJs的版本

4、编译和部署合约
npx hardhat compile 编译合约,编译后的内容存储在artifacts和cache文件夹中
npx hardhat run scripts/deployFundMe.js --network sepolia 部署合约
5、存储敏感信息的方式
npm install dotenv -D 创建.env文件写配置信息 在需要的地方写 require("dotenv").config()//必须写config
npm install -D @chainlink/env-enc 可以加密敏感信息
然后执行
npx env-enc set-pw 设置本地密码
npx env-enc set 就可以加密敏感信息了
6、合约验证
使用命令对合约进行验证 配置网络和合约地址以及构造函数的参数
npx hardhat verify --network sepolia 0x2Bc71D163Fc6A77EBcCf1c376A26AaC0e830b20c "10"
7、执行task
npx hardhat deploy-fundMe --network sepolia
npx hardhat interact-fundMe --addr [address] --network sepolia
8、安装hardhat-deploy
npm install -D hardhat-deploy 在config中 require('hardhat-deploy')

如果task添加了标签，就可以通过标签来筛选task来运行
npx hardhat deploy --network sepolia --tags fundMe

如果使用了hardhat deploy插件来部署合约，需要在后面加上--reset，或者删除deployments文件夹，不然不会重新部署，而是reusing以前的
npx hardhat deploy --network sepolia --reset 如果源码有修改，不加也会重新部署

npm install --save-dev @nomicfoundation/hardhat-network-helpers

npm install --save-dev @nomicfoundation/hardhat-ethers@3hardhat 不安装也可以