//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * 1.创建一个收款函数
 * 2.记录投资人并且查看
 * 3.在锁定期内，达到目标值，生产商可以退款
 * 4.在锁定期内，没有达到目标值，投资人可以退款
 */
contract FundMe {

    AggregatorV3Interface public dataFeed;

    mapping(address => uint256) public fundersToAmount;
    //最小筹款金额 单位是USD
    uint256 constant private MINIMUM_VALUE = 10 * 10 ** 18;

    uint256 constant private TARGET = 20 * 10 ** 18;

    address public owner;
    uint256 public deploymentTimestamp;
    uint256 public lockTime;
    address private erc20Address;
    bool public getFundSuccess;

    event FundWithdrawByOwner(uint256 amount);
    event RefundByFunder(address, uint256);

    constructor(uint256 _lockTime, address addr) {
        dataFeed = AggregatorV3Interface(addr);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    //payable 表示可以方法可以收取验证通证eth。
    function fund() external payable {
        require(block.timestamp <= deploymentTimestamp + lockTime, "fund time is end");
        require(convertEthToUSD(msg.value) >= MINIMUM_VALUE, "send More Eth");
        fundersToAmount[msg.sender] = fundersToAmount[msg.sender] + msg.value;
    }

    function getFund(bytes32 transferType) external windowClosed onlyOwner {
        //获取合约余额
        uint256 ethBalance = address(this).balance;
        require(convertEthToUSD(ethBalance) >= TARGET, "Not Reach Target");
        require(msg.sender == owner, "Not Owner,can't getFund");
        uint256 balance = address(this).balance;
        if (transferType == "transfer") {
            //transfer 纯转账 转账是由调用合约的人发起的。 如果失败会revert错误
            payable(msg.sender).transfer(address(this).balance);
        } else if (transferType == "send") {
            //send 如果是否会返回false
            bool success = payable(msg.sender).send(address(this).balance);
            require(success, "send fail");
        } else {
            //call 可以实现转账还是带上data，还可以有返回值数据和状态 推荐都使用call，但是有重入风险，要注意代码安全性
            //没有需要传输的数据，所以参数写空字符串
            bool success;
            (success,) = payable(msg.sender).call{value: address(this).balance}("");
            require(success, "call fail");
        }
        getFundSuccess = true;
        emit FundWithdrawByOwner(balance);
    }

    function refund() external windowClosed {
        uint256 ethBalance = address(this).balance;
        require(convertEthToUSD(ethBalance) < TARGET, "already Reach Target,can't refund");
        require(fundersToAmount[msg.sender] > 0, "there is not your fund,can't refund");
        uint256 refundAmount = fundersToAmount[msg.sender];
        fundersToAmount[msg.sender] = 0; //先执行将sender的余额设置为0，在退款给sender
        payable(msg.sender).transfer(refundAmount);
        emit RefundByFunder(msg.sender, refundAmount);
    }


    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    /**
      * Returns the latest answer.
      */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
        /* uint80 roundId */,
            int256 answer,
        /*uint256 startedAt*/,
        /*uint256 updatedAt*/,
        /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUSD(uint256 ethAmount) internal view returns (uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / 10 ** 8;
    }

    function setFunderAmount(address funderAddress, uint256 amount) external {
        require(msg.sender == erc20Address, "you can't do this");
        fundersToAmount[funderAddress] = amount;
    }

    function setErc20Address(address _erc20Address) external onlyOwner {
        erc20Address = _erc20Address;
    }

    modifier windowClosed(){
        require(block.timestamp >= deploymentTimestamp + lockTime, "the window is not closed");
        _;//应用这个modifier的函数的其他操作，放在后面就表示先执行require在执行其他操作，如果放在前面就是先执行其他操作，在执行require
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Not Owner");
        _;
    }
}