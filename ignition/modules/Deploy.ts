import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FIVE_THOUSAND_ETH = 5000000000000000000000n;
const ONE_HUNDRED_ETH = 100000000000000000000n;

const DeploymentModule = buildModule("DeploymentModule", (m) => {
  const rewardPool = m.contract("RewardPool", [], {
    value: FIVE_THOUSAND_ETH,
  });
  const staking = m.contract("Staking", [], {
    value: ONE_HUNDRED_ETH,
  });
  m.call(staking, "setRewardPool", [rewardPool]);
  m.call(rewardPool, "setStakingContract", [staking]);

  return { rewardPool, staking };
});

export default DeploymentModule;
