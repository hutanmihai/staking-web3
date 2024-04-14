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
    mapping(uint => Position) private positions;
    mapping(address => uint[]) private positionsIdsByAddress;
    mapping(uint => uint) private tiers;
    uint[] private lockPeriods;

    event Staked(address indexed staker, uint positionId, uint weiAmount, uint interestRate, uint unlockDate);
    event Closed(address indexed staker, uint positionId, uint returnedAmount);

    constructor() payable {
        owner = msg.sender;
        currentPositionId = 0;

        lockPeriods = [1 minutes, 2 minutes, 3 minutes];
        tiers[1 minutes] = 60;
        tiers[2 minutes] = 70;
        tiers[3 minutes] = 80;
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

    function setRewardPool(address payable _rewardPool) external onlyOwner {
        rewardPool = RewardPool(_rewardPool);
    }

    function stakeEther(uint numSeconds) external payable {
        require(tiers[numSeconds] > 0, "Invalid number of days");
        require(msg.value > 0, "Must send ether to stake");

        uint unlockDate = block.timestamp + numSeconds;
        uint interest = calculateInterest(msg.value, tiers[numSeconds]);

        positions[currentPositionId] = Position(
            currentPositionId,
            msg.sender,
            block.timestamp,
            unlockDate,
            tiers[numSeconds],
            msg.value,
            interest,
            true
        );

        positionsIdsByAddress[msg.sender].push(currentPositionId);

        emit Staked(msg.sender, currentPositionId, msg.value, tiers[numSeconds], unlockDate);
        currentPositionId++;
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

    function getPositionsIdsByAddress(address walletAddress) external view returns (uint[] memory) {
        return positionsIdsByAddress[walletAddress];
    }

    function getPositionById(uint positionId) external view returns (Position memory) {
        return positions[positionId];
    }

    function getLockPeriods() external view returns (uint[] memory) {
        return lockPeriods;
    }
}
