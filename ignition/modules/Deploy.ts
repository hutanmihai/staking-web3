import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ONE_HUNDRED_ETH = 100000000000000000000n;

const DeploymentModule = buildModule("DeploymentModule", (m) => {
  const rewardPool = m.contract("RewardPool", [], {
    value: ONE_HUNDRED_ETH,
  });
  const staking = m.contract("Staking", [], {
    value: ONE_HUNDRED_ETH,
  });
  m.call(staking, "setRewardPool", [rewardPool]);
  m.call(rewardPool, "setStakingContract", [staking]);

  return { rewardPool, staking };
});

export default DeploymentModule;
