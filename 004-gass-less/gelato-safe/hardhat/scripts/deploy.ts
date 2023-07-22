import { ethers } from "hardhat";

async function main() {
  const gelatoNFT = await ethers.deployContract("GelatoNFT");

  const deployed = await gelatoNFT.waitForDeployment();
  console.log(await deployed.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
