// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Objects is ERC1155 {
    event PermanentURI(string _value, uint256 indexed _id);

    error exceedssupply();

    mapping(uint256 => uint256) public supply;

    using Strings for uint256;
    string internal baseuri;
    string public uriSuffix = ".json";

    constructor()
        ERC1155(
            "https://ipfs.moralis.io:2053/ipfs/QmbCUjN57GbsPsQhcqjNwSf2DDbRthqy5DYKbqPSwwTBX6/metadata/"
        )
    {
        create(0, 99, "");
        create(1, 100, "");
        create(2, 1, "");
        setURI(
            "https://ipfs.moralis.io:2053/ipfs/QmbCUjN57GbsPsQhcqjNwSf2DDbRthqy5DYKbqPSwwTBX6/metadata/"
        );
    }

    function create(
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        uint256 max = supply[id];
        if (max >= 100) {
            revert exceedssupply();
        }
        supply[id] += amount;
        _mint(msg.sender, id, amount, data);
        //string memory eventuri = tokenURI(id);
        emit PermanentURI(uri(id), id);
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = baseuri;
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        _tokenId.toString(),
                        uriSuffix
                    )
                )
                : "";
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return supply[tokenId] > 0;
    }

    function setURI(string memory _baseuri) internal {
        baseuri = _baseuri;
    }
}
