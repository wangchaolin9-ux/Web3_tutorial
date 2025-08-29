solidity 和hardhat学习
1、创建项目：
npm init
npm install -D hardhat@^2.26.3
npx hardhat 创建hardhat项目
2、安装依赖
npm install @chainlink/contracts --save
npm install --save-dev @openzeppelin/contracts

3、安装nodeJs
brew install nvm  然后根据提示创建工作目录和配置环境变量
nvm install 18 直接跟版本号就可以安装
uvm use 20  可以切换nodeJs的版本

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

