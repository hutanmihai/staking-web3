import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const INITIAL_OWNER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const YeezyModule = buildModule("YeezyModule", (m) => {
  const initialOwner = m.getParameter("initialOwner", INITIAL_OWNER_ADDRESS);
  const yeezy = m.contract("Yeezy", [initialOwner], {});

  return {yeezy};
});

export default YeezyModule;
