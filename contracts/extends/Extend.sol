// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

abstract contract Parent {
    uint256 public a;

    function addOne() public {
        a += 1;
    }
    //虚函数子类实现逻辑
    function add() public virtual;
}

contract Child is Parent {
    function addTwo() public {
        a += 2;
    }
    //重写父合约的虚函数
    function add() public override {
        a += 3;
    }
}
