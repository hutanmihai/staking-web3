import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: "AFFI594FSINK9SXR6933PKHA1UVHU67IQ5",
  },
  sourcify: {
    enabled: true,
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
