import { ethers } from "hardhat";

async function main() {
  const flashLoan = await ethers.deployContract("FlashLoan", [
    "0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D",
  ]);

  await flashLoan.waitForDeployment();

  console.log("Flashloan contract deployed: ", flashLoan.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
