require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    blaze: {
      url: process.env.SONIC_RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 57054,
      ethNetwork: "sonic blaze testnet"
    },
  },
};
