import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import "ts-node/register";

dotenv.config();

const PK = process.env.PRIVATE_KEY || "";
const SCS_API_KEY = process.env.SCS_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "minato",
  networks: {
    hardhat: {},
    minato: {
      url: `https://soneium-minato.rpc.scs.startale.com?apikey=${SCS_API_KEY}`,
      accounts: [PK],
    },
  },
  etherscan: {
    apiKey: {
      minato: "NO API KEY",
    },
    customChains: [
      {
        network: "minato",
        chainId: 1946,
        urls: {
          apiURL: "https://explorer-testnet.soneium.org/api",
          browserURL: "https://explorer-testnet.soneium.org",
        },
      },
    ],
  },
};

export default config;
