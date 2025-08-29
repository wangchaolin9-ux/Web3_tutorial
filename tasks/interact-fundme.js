const {task} = require("hardhat/config")

task("interact-fundMe","测试合约和查询金额").addParam("address", "fundMe contract address").setAction(async (taskArgs, hre) => {

    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.address);

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
})

module.exports = {}