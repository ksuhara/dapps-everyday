import { ethers } from "hardhat";

async function main() {
  const simpleERC721 = await ethers.deployContract("SimpleERC721");

  await simpleERC721.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
