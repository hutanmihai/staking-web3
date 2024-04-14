import { ethers, network } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { RewardPool, Staking } from "../typechain-types";

describe("Staking and Reward Pool Contracts", function () {
  let staking: Staking;
  let rewardPool: RewardPool;
  let owner: Signer;
  let user: Signer;
  let addr1: string;
  let addr2: string;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    addr1 = await owner.getAddress();
    addr2 = await user.getAddress();
    const RewardPool = await ethers.getContractFactory("RewardPool");
    const Staking = await ethers.getContractFactory("Staking");

    rewardPool = await RewardPool.deploy({
      value: ethers.parseEther("10"),
    });
    staking = await Staking.deploy();

    await staking.setRewardPool(await rewardPool.getAddress());
    await rewardPool.setStakingContract(await staking.getAddress());
  });

  it("should set the right owner", async function () {
    expect(await rewardPool.owner()).to.equal(addr1);
  });

  it("should receive and store Ether", async function () {
    const initialBalance = await ethers.provider.getBalance(
      await rewardPool.getAddress(),
    );
    expect(initialBalance).to.equal(ethers.parseEther("10"));
  });

  it("should allow the owner to set the staking contract", async function () {
    await rewardPool.setStakingContract(await staking.getAddress());
    expect(await rewardPool.stakingContract()).to.equal(
      await staking.getAddress(),
    );
  });

  it("should not allow non-owners to set the staking contract", async function () {
    await expect(
      rewardPool.connect(user).setStakingContract(await staking.getAddress()),
    ).to.be.revertedWith("Only owner can set the staking contract");
  });

  it("should allow sending rewards from the staking contract", async function () {
    await staking
      .connect(user)
      .stakeEther(60, { value: ethers.parseEther("1") });

    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    const txResponse = await staking.connect(user).closePosition(0);
    await txResponse.wait();

    const finalBalance = await ethers.provider.getBalance(addr2);
    const expectedReward = ethers.parseEther("1.06");
    // @ts-ignore
    expect(finalBalance).to.be.closeTo(
      await ethers.provider.getBalance(addr2),
      expectedReward,
      ethers.parseEther("0.01"),
    );
  });

  it("should reject sending rewards from unauthorized addresses", async function () {
    await expect(
      rewardPool.connect(user).sendReward(addr2, ethers.parseEther("1")),
    ).to.be.revertedWith("Only staking contract can perform this action");
  });

  it("should allow users to stake Ether", async function () {
    await staking
      .connect(user)
      .stakeEther(60, { value: ethers.parseEther("1") });
    const position = await staking.getPositionById(0);
    expect(position.weiStaked).to.equal(ethers.parseEther("1"));
  });

  it("should emit an event on staking", async function () {
    await expect(
      staking.connect(user).stakeEther(60, { value: ethers.parseEther("1") }),
    ).to.emit(staking, "Staked");
  });

  it("should allow closing positions after the lock period", async function () {
    const initialBalance = await ethers.provider.getBalance(addr2);
    await staking
      .connect(user)
      .stakeEther(60, { value: ethers.parseEther("1") });

    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    const txResponse = await staking.connect(user).closePosition(0);
    await txResponse.wait();

    const finalBalance = await ethers.provider.getBalance(addr2);
    const expectedReward = ethers.parseEther("1.06");
    expect(finalBalance).to.be.closeTo(initialBalance, expectedReward);
  });

  it("should not allow closing positions before the lock period", async function () {
    await staking
      .connect(user)
      .stakeEther(60, { value: ethers.parseEther("1") });
    await expect(staking.connect(user).closePosition(0)).to.be.revertedWith(
      "Position still locked",
    );
  });
});
