//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Example {
    struct User {
        uint age;
        string name;
    }

    User[] public users;

    constructor() {
        users.push(User(18, "Alice"));
        users.push(User(20, "Bob"));
    }

    // 修改存储在链上的数据
    function updateUser(uint index, uint newAge) public {
        User storage u = users[index];  // 引用链上存储的用户
        u.age = newAge;                 // 改动会永久写入 storage
    }

    // 不会修改链上的数据
    function tryUpdateUser(uint index, uint newAge) public {
        User memory u = users[index];  // 拷贝一份到内存
        u.age = newAge;                // 改的是临时副本，链上数据不变
    }
}