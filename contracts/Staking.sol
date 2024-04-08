// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Staking {
    address public owner;

    struct Position {
        uint poisitonId;
        address walletAddress;
        uint createdDate;
        uint unlockDate;
        uint percentInterest;
        uint weiStaked;
        uint weiInterest;
        bool open;
    }

    Position position;

    uint public currentPosisitonId;
    mapping(uint => Position) public positions;
    mapping(address => uint[]) public positionIdsByAddress;
    mapping(uint => uint) public tiers;
    uint[] public lockPeriods;

    constructor() payable {
        owner = msg.sender;
        currentPosisitonId = 0;

        lockPeriods = [0 days, 30 days, 60 days, 90 days];

        tiers[0 days] = 50;
        tiers[30 days] = 60;
        tiers[60 days] = 70;
        tiers[90 days] = 80;
    }

    function stakeEther(uint numDays) external payable {
        require(tiers[numDays] > 0, "Invalid number of days");

        positions[currentPosisitonId] = Position(
            currentPosisitonId,
            msg.sender,
            block.timestamp,
            block.timestamp + numDays * 1 days,
            tiers[numDays],
            msg.value,
            calculateInterest(msg.value, tiers[numDays]),
            true
        );

        positionIdsByAddress[msg.sender].push(currentPosisitonId);
        currentPosisitonId++;
    }

    function calculateInterest(uint basisPoints, uint weiAmount) private pure returns (uint) {
        return (basisPoints * weiAmount) / 10000;
    }

    function getLockPerios() external view returns (uint[] memory) {
        return lockPeriods;
    }

    function getInterestRate(uint numDays) external view returns (uint) {
        return tiers[numDays];
    }

    function getPositionIdsByAddress(address walletAddress) external view returns (uint[] memory) {
        return positionIdsByAddress[walletAddress];
    }

    function closePosition(uint positionId) external {
        require(positions[positionId].walletAddress == msg.sender, "You are not the owner of this position");
        require(positions[positionId].open, "Position is already closed");
        require(block.timestamp >= positions[positionId].unlockDate, "Position is still locked");

        positions[positionId].open = false;
        uint amount = positions[positionId].weiStaked + positions[positionId].weiInterest;
        payable(msg.sender).transfer(amount);
    }
}
