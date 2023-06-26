import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("UniswapAMM", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, lpProvider, swapper] = await ethers.getSigners();

    const LPToken = await ethers.getContractFactory("LPToken");
    const lpToken = await LPToken.deploy();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mock1 = await MockERC20.deploy();
    const mock2 = await MockERC20.deploy();

    const UniswapAMMPair = await ethers.getContractFactory("UniswapAMMPair");
    const uniswapAMMPair = await UniswapAMMPair.deploy(
      await mock1.getAddress(),
      await mock2.getAddress(),
      await lpToken.getAddress()
    );

    const uniswapAMMPairAddress = await uniswapAMMPair.getAddress();

    const lpProviderERC20TokenAmount = 10 ** 10;
    await mock1.mint(lpProvider.address, lpProviderERC20TokenAmount);
    await mock2.mint(lpProvider.address, lpProviderERC20TokenAmount);
    await mock1
      .connect(lpProvider)
      .approve(uniswapAMMPairAddress, lpProviderERC20TokenAmount);
    await mock2
      .connect(lpProvider)
      .approve(uniswapAMMPairAddress, lpProviderERC20TokenAmount);

    const swapperERC20TokenAmount = 10 ** 10;
    await mock1.mint(swapper.address, swapperERC20TokenAmount);
    await mock2.mint(swapper.address, swapperERC20TokenAmount);
    await mock1
      .connect(swapper)
      .approve(uniswapAMMPairAddress, swapperERC20TokenAmount);
    await mock2
      .connect(swapper)
      .approve(uniswapAMMPairAddress, swapperERC20TokenAmount);

    return {
      mock1,
      mock2,
      lpToken,
      uniswapAMMPair,
      owner,
      lpProvider,
      swapper,
      lpProviderERC20TokenAmount,
    };
  }

  describe("Deployment", function () {
    it("Should receive and store the funds to lock", async function () {
      const { lpToken, uniswapAMMPair, lpProvider, swapper, mock1, mock2 } =
        await loadFixture(deployFixture);

      await uniswapAMMPair.connect(lpProvider).addLiquidity(1000000, 1000000);
      const lpBalance = await lpToken.balanceOf(lpProvider.address);
      expect(lpBalance).to.equal(999000);

      const beforeBalanceOfMock1 = await mock1.balanceOf(swapper.address);
      const beforeBalanceOfMock2 = await mock2.balanceOf(swapper.address);

      await uniswapAMMPair
        .connect(swapper)
        .swap(20000, await mock1.getAddress(), await mock2.getAddress());

      const afterBalanceOfMock1 = await mock1.balanceOf(swapper.address);
      const afterBalanceOfMock2 = await mock2.balanceOf(swapper.address);

      expect(beforeBalanceOfMock1 - afterBalanceOfMock1).to.equal(20000);
      console.log(beforeBalanceOfMock2, afterBalanceOfMock2);
      // expect(afterBalanceOfMock2 - beforeBalanceOfMock2).to.equal(1000000)

      await lpToken.connect(lpProvider).approve(uniswapAMMPair, 999000);
      await uniswapAMMPair.connect(lpProvider).removeLiquidity(999000);

      const lpBalanceAfterRemove = await lpToken.balanceOf(lpProvider.address);
      console.log(lpBalanceAfterRemove);
      const balanceOfMock1 = await mock1.balanceOf(lpProvider.address);
      const balanceOfMock2 = await mock2.balanceOf(lpProvider.address);
      console.log(balanceOfMock1, balanceOfMock2);
    });
  });
});
