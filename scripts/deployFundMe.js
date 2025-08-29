//import ethers ethers.js是用来部署合约使用的
//create main function 创建主函数
//execute main function 执行主函数
// const {ethers} = require("hardhat"); //只引入ethers 我发现不引入ethers也可以直接用

async function main() {
    //创建一个合约工厂,这个工厂是用来创建FundMe合约的
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying contract...")
    //通过工厂部署合约
    const fundMe = await fundMeFactory.deploy(120);//如果合约的构造函数有参数，则需要传入参数
    await fundMe.waitForDeployment();//等待合约部署完成
    console.log(`Contract deployed to ${fundMe.target}`)
    await verify(fundMe, [120]);
    await testContract(fundMe)
}

async function testContract(fundMe) {
    //init two accounts 这样就可以获取到hardhat.config.js中的配置的账号私钥
    const [firstAccount, secondAccount] = await ethers.getSigners();
    //fund the contract with the first account
    const fundTx = await fundMe.connect(firstAccount).fund({value: ethers.parseEther("0.003")});
    await fundTx.wait();
    //检查合约余额
    let balance = await ethers.provider.getBalance(fundMe.target);
    console.log(`第一个账户fund后，合约余额是${balance}`)
    //使用第二个账户fund
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.003")});
    await fundTxWithSecondAccount.wait();
    //再次检查合约余额
    balance = await ethers.provider.getBalance(fundMe.target);
    console.log(`第二个账户fund后，合约余额是${balance}`)

    const balanceOfFirstAccount = await fundMe.fundersToAmount(firstAccount.address);
    const balanceOfSecondAccount = await fundMe.fundersToAmount(firstAccount.address);
    console.log(`第一个账户的余额是${balanceOfFirstAccount}`)
    console.log(`第二个账户的余额是${balanceOfSecondAccount}`)
}

async function verify(fundMe, args) {
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contract...")
        //部署完成后等待5个区块后，在进行验证，避免浏览器延迟导致的验证失败
        await fundMe.deploymentTransaction().wait(3)
        //部署完成后对合约进行验证
        await hre.run("verify:verify", {
            address: fundMe.target,
            constructorArguments: args,
        });
        console.log("Contract verified")
    } else {
        console.log("Not on sepolia network, skipping verification...")
    }
}

//执行main函数
main().then().catch((error) => {
    console.error(error)
    process.exit(1)//正常退出可以使用0，异常退出使用1
});