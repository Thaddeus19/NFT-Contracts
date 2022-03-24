// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ERC721 contract
 * ERC721 contract has minting functionality.
 */
contract NFTToken is ERC721, AccessControl, Ownable {
    error thecontractispaused();
    error havenoadminrole();
    error havenominterrole();
    error maxsupplyexceeded();

    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _nextTokenId;

    string public uriPrefix = "";
    string public uriSuffix = ".json";

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public maxSupply = 10;

    bool public paused = false;

    constructor(string memory _baseUri) ERC721("NFT Test", "CNFT") {
        //nextTokenId is initialized to 1, since starting at 0 leads to higher gas cost for the first minter
        _nextTokenId.increment();

        //This function (_setupRole) helps to assign an administrator role that can then assign new roles.
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        setUriPrefix(_baseUri);
    }

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mintTo(address _to) public {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert havenominterrole();
        }
        if (paused) {
            revert thecontractispaused();
        }
        if (totalSupply() >= maxSupply) {
            revert maxsupplyexceeded();
        }
        uint256 currentTokenId = _nextTokenId.current();
        _nextTokenId.increment();
        _safeMint(_to, currentTokenId);
    }

    function mint() public {
        if (paused) {
            revert thecontractispaused();
        }
        if (totalSupply() >= maxSupply) {
            revert maxsupplyexceeded();
        }
        uint256 currentTokenId = _nextTokenId.current();
        _nextTokenId.increment();
        _safeMint(msg.sender, currentTokenId);
    }

    /**
        @dev Returns the total tokens minted so far.
        1 is always subtracted from the Counter since it tracks the next available tokenId.
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId.current() - 1;
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;

        while (
            ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply
        ) {
            address currentTokenOwner = ownerOf(currentTokenId);

            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;

                ownedTokenIndex++;
            }

            currentTokenId++;
        }

        return ownedTokenIds;
    }

    //If you need the option to pause the contract, activate this function and the ADMIN role.
    function setPaused(bool _state) public {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert havenoadminrole();
        }
        paused = _state;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
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

    function setUriPrefix(string memory _uriPrefix) internal {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert havenoadminrole();
        }
        uriPrefix = _uriPrefix;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return uriPrefix;
    }

    ///@dev Use this function only in testnet to delete the contract at the end of the tests
    function kill() public {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert havenoadminrole();
        }
        address payable addr = payable(address(msg.sender));
        selfdestruct(addr);
    }
}
