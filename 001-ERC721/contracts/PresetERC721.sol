// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract PresetERC721 is ERC721PresetMinterPauserAutoId {
    constructor()
        ERC721PresetMinterPauserAutoId(
            "PresetERC721",
            "PNFT",
            "https://example.com/"
        )
    {}
}
