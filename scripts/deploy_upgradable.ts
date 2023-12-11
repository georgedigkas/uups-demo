import { ethers, upgrades } from "hardhat";

async function main() {
  const validators = [
    {
      validatorAddress: "0x5567f54B29B973343d632f7BFCe9507343D41FCa",
      validatorWeight: 1000,
    },
    {
      validatorAddress: "0x6E78914596C4c3fA605AD25A932564c753353DcC",
      validatorWeight: 1000,
    },
  ];

  const Bridge = await ethers.getContractFactory("Bridge");
  console.log("Deploying Bridge...");
  const proxy = await upgrades.deployProxy(Bridge, [validators], {
    initializer: "initialize",
  });
  await proxy.waitForDeployment();
  console.log("Proxy deployed to:", await proxy.getAddress());
  console.log("Bridge Value:", (await proxy.get()).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
