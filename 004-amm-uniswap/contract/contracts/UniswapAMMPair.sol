// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./LPToken.sol";

contract UniswapAMMPair {
    using SafeMath for uint;

    uint public constant MINIMUM_LIQUIDITY = 10 ** 3;

    address public token0;
    address public token1;
    address public lpToken;

    uint private reserve0;
    uint private reserve1;

    constructor(address _token0, address _token1, address _lpToken) public {
        token0 = _token0;
        token1 = _token1;
        lpToken = _lpToken;
    }

    function _quote(
        uint amountA,
        uint reserveA,
        uint reserveB
    ) internal pure returns (uint amountB) {
        require(amountA > 0, "UniswapV2Library: INSUFFICIENT_AMOUNT");
        require(
            reserveA > 0 && reserveB > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        amountB = amountA.mul(reserveB) / reserveA;
    }

    function _calculateAddLiquidityRate(
        uint amountADesired,
        uint amountBDesired
    ) private returns (uint amountA, uint amountB) {
        if (reserve0 == 0 && reserve1 == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint amountBOptimal = _quote(amountADesired, reserve0, reserve1);
            if (amountBOptimal <= amountBDesired) {
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint amountAOptimal = _quote(
                    amountBDesired,
                    reserve1,
                    reserve0
                );
                assert(amountAOptimal <= amountADesired);
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }

    function addLiquidity(
        uint amountADesired,
        uint amountBDesired
    ) public returns (uint liquidity) {
        (uint amountA, uint amountB) = _calculateAddLiquidityRate(
            amountADesired,
            amountBDesired
        );
        IERC20(token0).transferFrom(msg.sender, address(this), amountA);
        IERC20(token1).transferFrom(msg.sender, address(this), amountB);
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        uint amount0 = balance0.sub(reserve0);
        uint amount1 = balance1.sub(reserve1);
        uint _totalSupply = LPToken(lpToken).totalSupply();
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
            LPToken(lpToken).mint(address(this), MINIMUM_LIQUIDITY);
        } else {
            liquidity = Math.min(
                amount0.mul(_totalSupply) / reserve0,
                amount1.mul(_totalSupply) / reserve1
            );
        }
        LPToken(lpToken).mint(msg.sender, liquidity);
        reserve0 = balance0;
        reserve1 = balance1;
    }

    function swap(
        uint amountIn,
        address tokenIn,
        address tokenOut
    ) public returns (uint amountOut) {
        require(tokenIn == token0 || tokenIn == token1, "Invalid input token");
        require(
            tokenOut == token0 || tokenOut == token1,
            "Invalid output token"
        );
        require(
            tokenIn != tokenOut,
            "Input and output tokens must not be the same"
        );

        IERC20 inputToken = IERC20(tokenIn);
        IERC20 outputToken = IERC20(tokenOut);

        require(inputToken.transferFrom(msg.sender, address(this), amountIn));

        uint reserveIn;
        uint reserveOut;

        if (tokenIn == token0) {
            reserveIn = reserve0;
            reserveOut = reserve1;
        } else {
            reserveIn = reserve1;
            reserveOut = reserve0;
        }

        amountOut = reserveOut.sub(
            reserveIn.mul(reserveOut).div(reserveIn.add(amountIn))
        );

        require(outputToken.transfer(msg.sender, amountOut));

        if (tokenIn == token0) {
            reserve0 = reserve0.add(amountIn);
            reserve1 = reserve1.sub(amountOut);
        } else {
            reserve1 = reserve1.add(amountIn);
            reserve0 = reserve0.sub(amountOut);
        }
    }

    function removeLiquidity(uint lpTokenAmount) public {
        require(
            LPToken(lpToken).transferFrom(
                msg.sender,
                address(this),
                lpTokenAmount
            )
        );

        uint amount0 = (lpTokenAmount * reserve0) /
            LPToken(lpToken).totalSupply();
        uint amount1 = (lpTokenAmount * reserve1) /
            LPToken(lpToken).totalSupply();

        require(IERC20(token0).transfer(msg.sender, amount0));
        require(IERC20(token1).transfer(msg.sender, amount1));

        LPToken(lpToken).burn(address(this), lpTokenAmount);

        reserve0 -= amount0;
        reserve1 -= amount1;
    }
}
