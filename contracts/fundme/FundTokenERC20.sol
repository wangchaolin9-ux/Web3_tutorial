// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {FundMe} from "./FundMe.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//1.让FundMe的参与者，基于mapping来领取通证
//2.让参与者可以transfer通证
//3.使用完成以后需要turn通证
contract FundTokenERC20 is ERC20 {
    FundMe private fundMe;
    constructor(address fundMeAddress) ERC20("FundTokenERC20", "FT"){
        fundMe = FundMe(fundMeAddress);
    }

    function mint(uint256 amountToMint) public onlyFundMeCompleted {
        require(fundMe.fundersToAmount(msg.sender) >= amountToMint, "you can't mint this many tokens");
        _mint(msg.sender, amountToMint);
        fundMe.setFunderAmount(msg.sender, fundMe.fundersToAmount(msg.sender) - amountToMint);
    }

    function claim(uint256 amountToClaim) public onlyFundMeCompleted {
        require(balanceOf(msg.sender) >= amountToClaim, "you can't claim this many tokens");
        _burn(msg.sender, amountToClaim);
    }

    modifier onlyFundMeCompleted(){
        require(fundMe.getFundSuccess(), "FundMe is not completed yet");
        _;
    }
}
