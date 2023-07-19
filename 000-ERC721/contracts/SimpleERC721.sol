// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleERC721 is ERC721 {
    constructor() ERC721("SimpleERC721", "SNFT") {}
}
