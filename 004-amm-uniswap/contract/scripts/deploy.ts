import { ethers } from "hardhat";

async function main() {
  const lptoken = await ethers.deployContract("LPToken");
  const lptokenContract = await lptoken.waitForDeployment();
  const lptokenContractAddress = await lptokenContract.getAddress();
  console.log(lptokenContractAddress);
  const uniswapAMMPair = await ethers.deployContract("UniswapAMMPair", [
    "0xE8729AFA0Be390141F61e78f2889b28caBE40bAc",
    "0x45C5A31f41d7fd8527353483F7488361883987fb",
    lptokenContractAddress,
  ]);

  const contract = await uniswapAMMPair.waitForDeployment();
  console.log(await contract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
