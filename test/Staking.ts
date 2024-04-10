import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  async function deployStakingFixture() {
    const [deployer, otherAccount] = await ethers.getSigners();
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy();
    return { staking, deployer, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { staking, deployer } = await deployStakingFixture();
      expect(await staking.owner()).to.equal(deployer.address);
    });

    it("Should initialize tiers and lock periods correctly", async function () {
      const { staking } = await deployStakingFixture();
      expect(await staking.getInterestRate(30 * 86400)).to.equal(60);
    });
  });

  describe("Staking Ether", function () {
    it("Allows users to stake ether", async function () {
      const { staking, otherAccount } = await deployStakingFixture();
      const stakeAmount = ethers.parseEther("1");

      const tx = await staking
        .connect(otherAccount)
        .stakeEther(30 * 86400, { value: stakeAmount });
      const receipt = await tx.wait();
      const events = (receipt as any).events;
      const stakedEvent = events.find((e: any) => e.event === "Staked");

      // Ensure the stakedEvent is not undefined
      expect(stakedEvent).to.not.be.undefined;
      expect(stakedEvent.args.staker).to.equal(otherAccount.address);
      expect(stakedEvent.args.weiAmount).to.equal(stakeAmount);
      // For dynamic values like interestRate and unlockDate, ensure they match expected values.
    });

    it("Fails for unsupported lock period", async function () {
      const { staking, otherAccount } = await deployStakingFixture();
      await expect(
        staking
          .connect(otherAccount)
          .stakeEther(15, { value: ethers.parseEther("0.1") }),
      ).to.be.revertedWith("Invalid number of days");
    });
  });

  describe("Closing Positions", function () {
    it("Allows closing positions after the lock period", async function () {
      const { staking, otherAccount } = await deployStakingFixture();
      await staking
        .connect(otherAccount)
        .stakeEther(0, { value: ethers.parseEther("1") });

      // Fast-forward time
      await ethers.provider.send("evm_increaseTime", [86400]); // Adjust based on the required lock period
      await ethers.provider.send("evm_mine");

      const positionIds = await staking.getPositionIdsByAddress(
        otherAccount.address,
      );

      // Ensure the position ID is obtained correctly
      expect(positionIds.length).to.be.greaterThan(0);

      await expect(staking.connect(otherAccount).closePosition(positionIds[0]))
        .to.emit(staking, "Closed")
        .withArgs(otherAccount.address, positionIds[0]); // Adjust according to actual event args
    });

    it("Prevents closing positions before the unlock date", async function () {
      const { staking, otherAccount } = await deployStakingFixture();
      await staking
        .connect(otherAccount)
        .stakeEther(30 * 86400, { value: ethers.parseEther("1") });

      const positionIds = await staking.getPositionIdsByAddress(
        otherAccount.address,
      );
      await expect(
        staking.connect(otherAccount).closePosition(positionIds[0]),
      ).to.be.revertedWith("Position is still locked");
    });
  });
});
