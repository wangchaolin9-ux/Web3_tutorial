//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {HelloWorld} from "./ComplexDataTypes.sol";

//一个文件可能存在多个合约，可以使用{}指定需要引入的合约
//还可以从github直接引入合约
//还可以引入本地依赖的中的合约

contract HelloWorldFactory {

    HelloWorld [] private hws;

    function createHelloWorld() public {
        hws.push(new HelloWorld());
    }

    function getHelloWorldByIndex(uint8 index) view public returns (HelloWorld) {
        return hws[index];
    }

    function callSayHelloFromFactory(uint8 index, uint8 _id) external view returns (string memory){
        return hws[index].sayHelloByMapping(_id);
    }

    function callSetHelloWordFromFactory(uint8 _index, string memory newStr, uint8 _id) public {
        hws[_index].setHelloWorldMapping(newStr, _id);
    }

}