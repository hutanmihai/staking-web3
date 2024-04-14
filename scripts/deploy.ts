import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy([], { value: ethers.parseEther("100") });
  await staking.waitForDeployment();
  console.log("Staking deployed to:", staking.address);

  const RewardPool = await ethers.getContractFactory("RewardPool");
  const rewardPool = await RewardPool.deploy(await staking.getAddress(), {
    value: ethers.parseEther("100"),
  });
  await rewardPool.waitForDeployment();
  console.log("RewardPool deployed to:", rewardPool.address);

  const setRewardPoolTx = await staking.setRewardPoolContract(
    rewardPool.address,
  );
  await setRewardPoolTx.wait();
  console.log("RewardPool contract set in Staking");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
