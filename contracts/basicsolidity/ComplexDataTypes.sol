// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HelloWorld {

    //声明一个结构体，只能用来定义不同类型的变量，不能在结构体中定义函数
    struct Info {
        string phrase;
        uint256 id;
        address addr;
    }

    Info [] private infos;
    mapping(uint8 => Info) public infoMapping;

    string private strVar = "Hello World";

    function sayHelloByArray(uint256 _id) external view returns (string memory){
        for (uint8 i = 0; i < infos.length; i++) {
            if (infos[i].id == _id) {
                return addInfo(infos[i].phrase);
            }
        }
        return addInfo(strVar);
    }

    function sayHelloByMapping(uint8 _id) external view returns (string memory){
        Info memory info = infoMapping[_id];
        //solidity 里面不能直接判断map返回的对象是否为null，map中取值永远不会是null，没有数据也会返回一个全部都是默认值的对象
        //所以判断addr是否是0x0来判断，mapping中是否有想查询的数据
        if (info.addr == address(0x0)) {
            return addInfo(strVar);
        }
        return addInfo(info.phrase);
    }

    function setHelloWorldArray(string memory newStr, uint256 _id) external {
        //结构体不需要使用new
        Info memory info = Info(newStr, _id, msg.sender);
        infos.push(info);
    }

    function setHelloWorldMapping(string memory newStr, uint8 _id) external {
        //结构体不需要使用new
        Info memory info = Info(newStr, _id, msg.sender);
        infoMapping[_id] = info;
    }

    function addInfo(string memory helloWordStr) internal pure returns (string memory){
        return string.concat(helloWordStr, " from hans's contract");
    }

}