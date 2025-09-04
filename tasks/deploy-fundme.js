const {task} = require("hardhat/config")

task("deploy-fundMe", "部署合约").setAction(async (taskArgs, hre) => {
    //创建一个合约工厂,这个工厂是用来创建FundMe合约的
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying contract...")
    //通过工厂部署合约
    const fundMe = await fundMeFactory.deploy(120);//如果合约的构造函数有参数，则需要传入参数
    await fundMe.waitForDeployment();//等待合约部署完成
    console.log(`Contract deployed to ${fundMe.target}`)
    await verify(fundMe, [120]);

})

async function verify(fundMe, args) {
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contract...")
        //部署完成后等待5个区块后，在进行验证，避免浏览器延迟导致的验证失败
        await fundMe.deploymentTransaction().wait(3)
        //部署完成后对合约进行验证
        await hre.run("verify:verify", {
            address: fundMe.target,//原生的Ethers v6，所以使用.target 而hardhat deploy插件中需要使用.address
            constructorArguments: args,
        });
        console.log("Contract verified")
    } else {
        console.log("Not on sepolia network, skipping verification...")
    }
}

module.exports = {}