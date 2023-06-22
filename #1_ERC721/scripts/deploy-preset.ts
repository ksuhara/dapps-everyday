import { ethers } from "hardhat";

async function main() {
  const presetERC721 = await ethers.deployContract("PresetERC721");

  const a = await presetERC721.waitForDeployment();
  console.log(await a.getAddress())

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
