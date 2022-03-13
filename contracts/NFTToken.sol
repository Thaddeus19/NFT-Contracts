// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Components.sol";

contract NFTToken is ERC721Components {
    constructor() ERC721Tradable("NFT Test", "CNFT") {}

    function baseTokenURI() public pure override returns (string memory) {}
}
