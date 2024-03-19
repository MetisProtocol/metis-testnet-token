import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
      metadata: {
        bytecodeHash: "none",
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://sepolia.drpc.org",
      accounts: [process.env.METIS_DEPLOYER_PRIKEY as string],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
          apiUrl: "https://api-sepolia.etherscan.io",
        },
      },
    },
    holesky: {
      url: "https://holesky.drpc.org",
      accounts: [process.env.METIS_DEPLOYER_PRIKEY as string],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
          apiUrl: "https://api-holesky.etherscan.io",
        },
      },
    },
    devnet: {
      url: process.env.DEVNET_RPC,
      accounts: [process.env.DEVNET_DEPLOYER_KEY as string],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
          apiUrl: process.env.DEVNET_EXPLORER_API,
        },
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
