const {task} = require("hardhat/config")

task("getFund", "提款").addParam("address", "合约参数").setAction(async (taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.address);
    await fundMe.getFund(ethers.encodeBytes32String("transfer"));
    console.log("提款成功")
})