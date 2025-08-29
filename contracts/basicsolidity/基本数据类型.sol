//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28; //^表示高于这个版本的编译器都可以编译我的代码
contract HelloWorld {
    bool public boolVar = false;
    //表示的无符号整数  后面的数字表示可以存在多大的数据,uint8的数据范围就是0-(2^8-1).
    uint8 public age = 255;
    uint256 public balance;//0-(2^256-1) 不写256只写uint代表的就是uint256

    //int可以存负数。不跟数字就表示int256.
    int256 public num = - 1;
    //后面也可以跟数字，最大只能32。表示可以存多少个字节。一般用来存在字符串。bytes后面不跟数字，表示的是一个数组，表示多个byte。
    bytes8 public name = "hello";
    //动态分配的bytes,占用的空间会更大一点，如果知道字符串有多大，而且不会超过32，建议用bytes
    string public  strVar = "Hello world";
    //地址类型，可以存区块链的地址，地址不需要双引号
    address public account = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;



}