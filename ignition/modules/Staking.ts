import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ONE_HUNDRED_ETH = 100000000000000000000n;

const StakingModule = buildModule("StakingModule", (m) => {
  const staking = m.contract("Staking", [], {
    value: ONE_HUNDRED_ETH,
  });

  return { staking };
});

export default StakingModule;
