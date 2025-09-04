const {assert, expect} = require("chai");
const {ethers, deployments, getNamedAccounts} = require("hardhat")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
network.name !== "hardhat" ? describe.skip :
    describe("test fundMe contract", async function () {

        //每个测试用例执行前都会执行这里
        let fundMe;
        let fundMeSecondAccount;
        let firstAccount;
        let secondAccount;
        let mockV3Aggregator;
        beforeEach(async function () {
            //部署了所有包含了all tag的合约
            await deployments.fixture(["all"])
            firstAccount = (await getNamedAccounts()).firstAccount
            secondAccount = (await getNamedAccounts()).secondAccount
            const fundMeDeployment = await deployments.get("FundMe"); //deployments可以跟踪合约的部署信息
            fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
            const secondSigner = await ethers.getSigner(secondAccount);
            fundMeSecondAccount = fundMe.connect(secondSigner);
            mockV3Aggregator = await deployments.get("MockV3Aggregator")
        })


        it("test if the owner is msg.sender", async function () {
            // 使用上面的fundMe了
            // const fundMeFactory = await ethers.getContractFactory("FundMe");
            // const fundMe = await fundMeFactory.deploy(120);
            // await fundMe.waitForDeployment()
            // const [firstAccount] = await ethers.getSigners();
            console.log("=====" + firstAccount)
            console.log("++++++" + (await fundMe.owner()))
            assert.equal(await fundMe.owner(), firstAccount)
        })

        it("test if the datafeed address", async function () {
            // 使用上面的fundMe了
            // const fundMeFactory = await ethers.getContractFactory("FundMe");
            // const fundMe = await fundMeFactory.deploy(120);
            // await fundMe.waitForDeployment()
            assert.equal(await fundMe.dataFeed(), mockV3Aggregator.address)
        })


        //fund  getFund refund
        it("window closed,fund failed", async function () {
            await helpers.time.increase(160);
            await helpers.mine() //模拟挖矿，等待是超过设置的lock time
            //使用expect来判断调用合约的方法是否会失败，后面填写require的提示失败信息
            await expect(fundMe.fund({value: ethers.parseEther("0.01")})).to.be.revertedWith("fund time is end")
        })

        it('window open,value is less min', async () => {
            await expect(fundMe.fund({value: ethers.parseEther("0.0000001")})).to.be.revertedWith("send More Eth")
        });

        it('window open,value is ok,fund success', async () => {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            const balance = await fundMe.fundersToAmount(firstAccount)
            assert.equal(balance, ethers.parseEther("0.1"))
        });

        //test getFund  onlyOwner windowClosed target reached
        it('not owner,window closed,target reached,get Fund fail', async () => {
            await fundMe.fund({value: ethers.parseEther("1")})//确保目标值达到

            await helpers.time.increase(160);
            await helpers.mine() //等待锁仓时间
            await expect(fundMeSecondAccount.getFund(ethers.encodeBytes32String("transfer"))).to.be.revertedWith("Not Owner")
        })

        it('window open,target reached,get fund fail', async () => {
            await fundMe.fund({value: ethers.parseEther("1")})//确保目标值达到
            await expect(fundMe.getFund(ethers.encodeBytes32String("transfer"))).to.be.revertedWith("the window is not closed")
        });

        it('window close,target not reached，get fund failed', async () => {
            await fundMe.fund({value: ethers.parseEther("0.0030")})//确保目标值没有达到
            await helpers.time.increase(160);
            await helpers.mine() //等待锁仓时间
            await expect(fundMe.getFund(ethers.encodeBytes32String("transfer"))).to.be.revertedWith("Not Reach Target")
        })
        it('window close,target reached,get fund success', async () => {
            await fundMe.fund({value: ethers.parseEther("1")})//确保目标值达到
            await helpers.time.increase(160);
            await helpers.mine() //等待锁仓时间
            await expect(fundMe.getFund(ethers.encodeBytes32String("transfer"))).to.emit(fundMe, "FundWithdrawByOwner").withArgs(ethers.parseEther("1"))
            assert.equal(await fundMe.getFundSuccess(), true);
        });

        it('window open,target not reached,refund fail', async () => {
            await fundMe.fund({value: ethers.parseEther("0.0030")})//确保目标值没有达到
            await expect(fundMe.refund()).to.be.revertedWith("the window is not closed");
        })

        it('window closed,target reached,refund fail', async () => {
            await fundMe.fund({value: ethers.parseEther("1")})//确保目标值没有达到
            await helpers.time.increase(160);
            await helpers.mine() //等待锁仓时间
            await expect(fundMe.refund()).to.be.revertedWith("already Reach Target,can't refund");
        })

        it('window closed,target reached,funder no balance,refund fail', async () => {
            await fundMe.fund({value: ethers.parseEther("0.0030")})//确保目标值没有达到
            await helpers.time.increase(160);
            await helpers.mine() //等待锁仓时间
            await expect(fundMeSecondAccount.refund()).to.be.revertedWith("there is not your fund,can't refund");
        })

        it('window closed,target not reached,funder has balance,refund success', async () => {
            await fundMe.fund({value: ethers.parseEther("0.0030")})//确保目标值没有达到
            await helpers.time.increase(160);
            await helpers.mine() //等待锁仓时间
            await expect(fundMe.refund()).to.emit(fundMe, "RefundByFunder").withArgs(firstAccount, ethers.parseEther("0.0030"))
        })

    });