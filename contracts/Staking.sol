// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import './RewardPool.sol';

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
    RewardPool public rewardPool;
    mapping(uint => Position) public positions;
    mapping(address => uint[]) public positionIdsByAddress;
    mapping(uint => uint) public tiers;
    uint[] public lockPeriods;

    event Staked(address indexed staker, uint positionId, uint weiAmount, uint interestRate, uint unlockDate);
    event Closed(address indexed staker, uint positionId, uint returnedAmount);

    constructor() payable {
        owner = msg.sender;
        currentPositionId = 0;

        lockPeriods = [30 days, 60 days, 90 days];
        tiers[30 days] = 60;
        tiers[60 days] = 70;
        tiers[90 days] = 80;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier canClosePosition(uint positionId) {
        require(positions[positionId].walletAddress == msg.sender, "Not the position owner");
        require(positions[positionId].open, "Position already closed");
        require(block.timestamp >= positions[positionId].unlockDate, "Position still locked");
        _;
    }

    function stakeEther(uint numDays) external payable {
        require(tiers[numDays] > 0, "Invalid number of days");
        require(msg.value > 0, "Must send ether to stake");

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


    function setRewardPool(address payable _rewardPool) external onlyOwner {
        rewardPool = RewardPool(_rewardPool);
    }

    function closePosition(uint positionId) external canClosePosition(positionId) {
        Position storage position = positions[positionId];
        require(position.open, "Position already closed");
        position.open = false;

        uint amount = position.weiStaked + position.weiInterest;
        emit Closed(msg.sender, positionId, amount);

        rewardPool.sendReward(payable(msg.sender), amount);
    }

    function calculateInterest(uint weiAmount, uint basisPoints) private pure returns (uint) {
        return (weiAmount * basisPoints) / 10000;
    }
}
