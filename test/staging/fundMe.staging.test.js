const {assert, expect} = require("chai");
const {ethers, deployments, getNamedAccounts} = require("hardhat")
network.name === "hardhat" ? describe.skip :
    describe("test fundMe contract", async function () {

        let fundMe;
        let firstAccount;
        beforeEach(async function () {
            await deployments.fixture(["all"])
            firstAccount = (await getNamedAccounts()).firstAccount
            const fundMeDeployment = await deployments.get("FundMe"); //deployments可以跟踪合约的部署信息
            fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        })

        it('fund and getFund successfully', async () => {
            await fundMe.fund({value: ethers.parseEther("0.005")})//确保目标值达到
            await new Promise(resolve => setTimeout(resolve, 170 * 1000))
            //真实链上，getFund只能表示发送成功了，不能表示执行成功
            const getFundTx = await fundMe.getFund(ethers.encodeBytes32String("transfer"));
            const getFundReceipt = await getFundTx.wait();
            expect(getFundReceipt).to.emit(fundMe, "FundWithdrawByOwner").withArgs(ethers.parseEther("0.005"))
            assert.equal(await fundMe.getFundSuccess(), true);
        });

        it('fund and refund successfully', async () => {
            await fundMe.fund({value: ethers.parseEther("0.0025")})//确保目标值达到
            await new Promise(resolve => setTimeout(resolve, 170 * 1000))
            const reFundTx = await fundMe.refund();
            const reFundReceipt = await reFundTx.wait();
            expect(reFundReceipt).to.emit(fundMe, "RefundByFunder").withArgs(firstAccount, ethers.parseEther("0.005"))
        });
    });