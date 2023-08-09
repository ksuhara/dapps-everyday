import { ethers } from "hardhat";

async function main() {
  const myToken = await ethers.deployContract("MyToken");
  const myTokenContract = await myToken.waitForDeployment();
  const myTokenContractAddress = await myTokenContract.getAddress();

  console.log(myTokenContractAddress);
  const minDelay = 1;
  const proposers = ["0x6a84E19A4801E5F003ea9d3202a38AE6a864DfdC"];
  const executors = ["0x6a84E19A4801E5F003ea9d3202a38AE6a864DfdC"];
  const admin = "0x6a84E19A4801E5F003ea9d3202a38AE6a864DfdC";
  const timelock = await ethers.deployContract("MyTimelock", [
    minDelay,
    proposers,
    executors,
    admin,
  ]);
  const timelockContract = await timelock.waitForDeployment();
  const timelockContractAddress = await timelockContract.getAddress();

  console.log(timelockContractAddress);

  const myGovernor = await ethers.deployContract("MyGovernor", [
    myTokenContractAddress,
    timelockContractAddress,
  ]);

  const contract = await myGovernor.waitForDeployment();
  console.log(await contract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
