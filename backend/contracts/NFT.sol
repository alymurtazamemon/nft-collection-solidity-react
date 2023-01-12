// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

pragma solidity ^0.8.17;

error NFT__InsufficientMintFee(uint256 insufficientMintFee);

contract NFT is ERC721URIStorage {
    // * STATE VARIABLES
    string private _nftTokenUri;
    uint256 private _mintFee;
    uint256 private _tokenCounter;

    // * FUNCTIONS
    constructor(
        string memory nftTokenUri,
        string memory name,
        string memory symbol,
        uint256 mintFee
    ) ERC721(name, symbol) {
        _nftTokenUri = nftTokenUri;
        _mintFee = mintFee;
        _tokenCounter = 0;
    }

    function mintNft() external payable {
        if (msg.value < _mintFee) {
            revert NFT__InsufficientMintFee(msg.value);
        }
    }
}
