import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const ONE_HUNDRED_ETH = 100000000000000000000n;

const RewardPoolModule = buildModule("RewardPoolModule", (m) => {
  const rewardPool = m.contract("RewardPool", [], {
    value: ONE_HUNDRED_ETH,
  });

  return {rewardPool};
});

export default RewardPoolModule;
