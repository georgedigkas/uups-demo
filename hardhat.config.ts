// import config before anything else
import { config as dotEnvConfig } from "dotenv";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import { HardhatUserConfig } from "hardhat/config";

dotEnvConfig();

// read MNEMONIC from file or from env variable
const mnemonic = process.env.MNEMONIC;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://sepolia.infura.io/v3/<key>",
      accounts: { mnemonic: mnemonic },
    },
    sepoliasui: {
      url: `https://eth-rpc.testnet.sui.io:443`,
      accounts: { mnemonic: mnemonic },
    },
  },
};

export default config;
