import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const StakingModule = buildModule("StakingModule", (m) => {
  const staking = m.contract("Staking", [], {});

  return {staking};
});

export default StakingModule;
