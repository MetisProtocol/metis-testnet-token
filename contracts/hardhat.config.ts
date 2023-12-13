import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      accounts: [vars.get("metis_testnet_deployer")],
      verify: {
        etherscan: {
          apiKey: vars.get("metis_testnet_etherscan_api_key"),
          apiUrl: "https://api-sepolia.etherscan.io",
        },
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
