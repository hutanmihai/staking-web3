// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract RewardPool {
    address public owner;
    address public stakingContract;

    modifier onlyStakingContract() {
        require(msg.sender == stakingContract, "Only staking contract can perform this action");
        _;
    }

    constructor() payable  {
        owner = msg.sender;
    }

    function setStakingContract(address _stakingContract) external {
        require(msg.sender == owner, "Only owner can set the staking contract");
        stakingContract = _stakingContract;
    }

    function sendReward(address payable staker, uint amount) external onlyStakingContract {
        require(address(this).balance >= amount, "Insufficient balance in reward pool");
        staker.transfer(amount);
    }

    receive() external payable {
        // Allows the contract to receive Ether
    }
}
