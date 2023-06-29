// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CToken is ERC20, ReentrancyGuard {
    ERC20 public underlying;
    uint public exchangeRate;
    uint public collateralFactor = 70; // This represents 70%

    mapping (address => uint) public borrowed;

    constructor(address _underlying) ERC20("Compound Token", "cToken") {
        underlying = ERC20(_underlying);
        exchangeRate = 1e18; // Initialize to 1:1 ratio
    }

    function mint(uint amount) external nonReentrant {
        // TODO: Implement interest accrual
        uint cTokens = amount * exchangeRate / 1e18;
        _mint(msg.sender, cTokens);
        underlying.transferFrom(msg.sender, address(this), amount);
    }
    
    function redeem(uint cTokens) external nonReentrant {
        // TODO: Implement interest accrual
        uint amount = cTokens * 1e18 / exchangeRate;
        _burn(msg.sender, cTokens);
        underlying.transfer(msg.sender, amount);
    }

    function borrow(uint amount) external {
        require(underlying.balanceOf(msg.sender) * collateralFactor / 100 >= amount, "Insufficient collateral");
        borrowed[msg.sender] += amount;
        underlying.transfer(msg.sender, amount);
    }

    function repay(uint amount) external {
        require(borrowed[msg.sender] >= amount, "You are not borrowing this much amount");
        borrowed[msg.sender] -= amount;
        underlying.transferFrom(msg.sender, address(this), amount);
    }

    function liquidate(address borrower) external {
        // This is a simplified and likely dangerous liquidation function
        // It doesn't take into account price feed oracles, safe liquidation amounts, incentive calculations, etc.
        // Use at your own risk and be sure to replace this with a safe implementation if you intend to use this code
        require(borrowed[borrower] > underlying.balanceOf(borrower) * collateralFactor / 100, "Borrower is not undercollateralized");
        uint liquidationAmount = borrowed[borrower] - underlying.balanceOf(borrower) * collateralFactor / 100;
        borrowed[borrower] -= liquidationAmount;
        underlying.transferFrom(msg.sender, address(this), liquidationAmount);
    }
}
