// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Staking {
    address public owner;

    struct Position {
        uint positionId;
        address walletAddress;
        uint createdDate;
        uint unlockDate;
        uint percentInterest;
        uint weiStaked;
        uint weiInterest;
        bool open;
    }

    uint public currentPositionId;
    mapping(uint => Position) public positions;
    mapping(address => uint[]) public positionIdsByAddress;
    mapping(uint => uint) public tiers;
    uint[] public lockPeriods;

    // Event declarations
    event Staked(address indexed staker, uint positionId, uint weiAmount, uint interestRate, uint unlockDate);
    event Closed(address indexed staker, uint positionId, uint returnedAmount);

    constructor() payable {
        owner = msg.sender;
        currentPositionId = 0;

        lockPeriods = [0 days, 30 days, 60 days, 90 days];

        tiers[0 days] = 50;
        tiers[30 days] = 60;
        tiers[60 days] = 70;
        tiers[90 days] = 80;
    }

    function stakeEther(uint numDays) external payable {
        require(tiers[numDays] > 0, "Invalid number of days");

        uint unlockDate = block.timestamp + numDays * 1 days;
        uint interest = calculateInterest(msg.value, tiers[numDays]);

        positions[currentPositionId] = Position(
            currentPositionId,
            msg.sender,
            block.timestamp,
            unlockDate,
            tiers[numDays],
            msg.value,
            interest,
            true
        );

        positionIdsByAddress[msg.sender].push(currentPositionId);

        emit Staked(msg.sender, currentPositionId, msg.value, tiers[numDays], unlockDate);

        currentPositionId++;
    }

    function calculateInterest(uint weiAmount, uint basisPoints) private pure returns (uint) {
        return (weiAmount * basisPoints) / 10000;
    }

    function closePosition(uint positionId) external {
        require(positions[positionId].walletAddress == msg.sender, "You are not the owner of this position");
        require(positions[positionId].open, "Position is already closed");
        require(block.timestamp >= positions[positionId].unlockDate, "Position is still locked");

        positions[positionId].open = false;
        uint amount = positions[positionId].weiStaked + positions[positionId].weiInterest;

        emit Closed(msg.sender, positionId, amount);

        payable(msg.sender).transfer(amount);
    }

    function getLockPeriods() external view returns (uint[] memory) {
        return lockPeriods;
    }

    function getInterestRate(uint numDays) external view returns (uint) {
        return tiers[numDays];
    }

    function getPositionIdsByAddress(address walletAddress) external view returns (uint[] memory) {
        console.log("Wallet address: %s", walletAddress);
        return positionIdsByAddress[walletAddress];
    }
}
