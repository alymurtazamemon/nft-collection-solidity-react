// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.17;

error NFT__InsufficientMintFee(uint256 insufficientMintFee);
error NFT__WithdrawTransactionFailed();

contract NFT is ERC721URIStorage, Ownable {
    // * STATE VARIABLES
    string private _nftTokenUri;
    uint256 private _mintFee;
    uint256 private _tokenCounter;

    // * EVENTS
    event NFTMinted(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed value
    );

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

        uint256 tokenId = _tokenCounter;
        _tokenCounter = _tokenCounter + 1;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _nftTokenUri);
        emit NFTMinted(msg.sender, tokenId, msg.value);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!success) {
            revert NFT__WithdrawTransactionFailed();
        }
    }
}
