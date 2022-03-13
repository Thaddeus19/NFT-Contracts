// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ContextMixin.sol";

/**
 * @title ERC721Tradable
 * ERC721Tradable - ERC721 contract has minting functionality.
 */
abstract contract ERC721Components is ERC721URIStorage, ContextMixin, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    /**
     * We rely on the OZ Counter util to keep track of the next available ID.
     * We track the nextTokenId instead of the currentTokenId to save users on gas costs.
     * Read more about it here: https://shiny.mirror.xyz/OUampBbIz9ebEicfGnQf5At_ReMHlZy0tB4glb9xQ0E
     */
    Counters.Counter private _nextTokenId;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        // nextTokenId is initialized to 1, since starting at 0 leads to higher gas cost for the first minter
        _nextTokenId.increment();
    }

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mintTo(address _to, string memory _uri) public onlyOwner {
        uint256 currentTokenId = _nextTokenId.current();
        _nextTokenId.increment();
        _safeMint(_to, currentTokenId);
        _setTokenURI(currentTokenId, _uri);
    }

    /**
        @dev Returns the total tokens minted so far.
        1 is always subtracted from the Counter since it tracks the next available tokenId.
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId.current() - 1;
    }

    function baseTokenURI() public pure virtual returns (string memory);

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory base = baseTokenURI();
        if (bytes(base).length != 0) {
            return
                string(
                    abi.encodePacked(baseTokenURI(), Strings.toString(_tokenId))
                );
        }
        return super.tokenURI(_tokenId);
    }

    /*function _tokenuri(uint256 _tokenId) public view returns (string memory) {
        return super.tokenURI(_tokenId);
    }*/

    /**
     * This is used instead of msg.sender as transactions won't be sent by the original token owner.
     */
    function _msgSender() internal view override returns (address sender) {
        return ContextMixin.msgSender();
    }
}
