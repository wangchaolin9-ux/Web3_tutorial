// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HelloWord {

    //这种在合约中声明的变量。默认就是storage永久存储，不需要显示声明为storage，写了还会报错。
    string private strVar = "Hello World";

    /**
     * external 只能合约外部和外部账户调用
     * internal 只能当前合约和子合约调用
     * private 只能当前合约调用，子合约都不行
     * public 内外部任何地方都可以调用
     *
     * view 表示这个函数，只读的，不能修改状态变量
     */
    function sayHello() external view returns (string memory){
//      strVar="Hello World2"; 如果修改编译就会报错
        return addInfo(strVar);
    }

    function setHelloWorld(string memory newStr) external {
        strVar = newStr;
    }

    /**
     *
     *solidity 的6种存储模式，现在先了解前三种
     * 1.storage 永久性存储，发布合约后，数据永久存储在区块链上
     * 2.memory 暂时性存储 当前交易或者当前函数运行结束以后，就拿不到他的值了，没有存储在区块链上。但是运行时可以修改
     * 3.calldata 暂时性存储 calldata修饰的参数，运行时不能修改，不能存储在区块链上
     * 4.stack 开发人员不会使用，是evm虚拟机使用，Solidity 里定义的局部变量、临时变量，最终都会编译成 EVM 指令，把数据存在 stack 上。
     * 5.codes 代表 合约的字节码本身。每个合约在部署时，EVM 会把它的运行字节码写到链上，存放在 code 区域。
     * 6.logs  是 事件 (event) 的底层存储。
                •当你在 Solidity 中写 emit EventName(...)，EVM 会把数据存到 logs 区域。
                •logs 存的数据不会被合约读取，只能在链外（比如区块浏览器、dApp 前端）通过 RPC 事件订阅拿到。
                •存在 Bloom Filter 里，方便节点快速索引。

       注意：如果是复杂数据结构，在参数中就需要告诉编译器是memory还是calldata
            string 底层就是bytes 数组，所以需要写memory或者calldata
     *
     * 函数修饰符 pure 表示这个函数是纯运算操作，不会修改值
     */
    function addInfo(string memory helloWordStr) internal pure returns (string memory){
//      strVar="Hello World2"; //如果修改编译就会报错
        return string.concat(helloWordStr, " from hans's contract");
    }

}