import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StakingModule = buildModule("StakingModule", (m) => {
  const myToken = m.contract("Staking", [], {});

  return { myToken };
});

export default StakingModule;
