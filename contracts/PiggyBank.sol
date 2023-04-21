//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract PiggyBank {
    event Deposit(uint amount);
    event Withdraw(uint amount);
    // event MappedTrans(address indexed depositor, uint amount);
    address immutable i_owner;
    mapping(address => uint256) public s_mappedTrans;

    // receive() external payable {
    //     mappedTrans[msg.sender] = msg.value;
    //    emit Deposit(msg.value);
    // }
    constructor() {
        i_owner = msg.sender;
    }

    // Had to use this save cause of i hadn't done for interacting with recieve in my frontend
    function deposit() external payable {
        s_mappedTrans[msg.sender] = msg.value;
        emit Deposit(msg.value);
    }

    function withdraw() external {
        require(msg.sender == i_owner, "Not Owner");
        emit Withdraw(address(this).balance);
        address payable to = payable(i_owner);
          (bool success, ) = to.call{value: address(this).balance}("");
        require(success,"Sending Failed");
        // selfdestruct doesn.t send back my fundz
        // selfdestruct(payable(msg.sender)); //hardhat is saying it has been depreciated
    }

    //GET MAPPED TRANS
    function getDepositor(
        address fundingAddress
    ) public view returns (uint256 amount) {
        amount = s_mappedTrans[fundingAddress];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
