// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.17;

error NFT__InsufficientMintFee(uint256 insufficientMintFee);
error NFT__WithdrawTransactionFailed();

/**
 * @title NFT - A ERC721URIStorage version of smart contract.
 * @author Ali Murtaza Memon
 * @notice This contract will mint ERC721 (aka NFT - Non-Fungible-Token) token
 * @dev This contract uses the ERC721URIStorage extension of ERC721 which provides the way to update the token uri with function `_setTokenURI`.
 * @custom:portfolio This is my portfolio project.
 */
contract NFT is ERC721URIStorage, Ownable {
    // * STATE VARIABLES
    string private _nftTokenUri;
    uint256 private immutable _mintFee;
    uint256 private _tokenCounter;

    // * EVENTS
    /**
     * @dev This event will be emitted inside mintNft function.
     * @param owner will be address who call the mintNft function.
     * @param tokenId will be the token id which user will have minted.
     * @param value will be the amount on which NFT will be minted.
     */
    event NFTMinted(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed value
    );
    /**
     * @dev This event will be emitted inside withdraw function.
     * @param amount will be the amount owner will withdraw at the timestamp.
     * @param timestamp will be the time of withdrawl.
     */
    event Withdraw(uint256 indexed amount, uint256 indexed timestamp);

    // * FUNCTIONS
    /**
     * @param nftTokenUri will be the token metadata ipfs hash.
     * @param name will be the name of the token.
     * @param symbol will be the symbol of the token.
     * @param mintFee will be the fee required to mint an NFT.
     */
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

    /**
     * @notice mintNft will mint the NFT on the blockchain.
     * @dev here I am using the _setTokenURI function to set the token uri.
     */
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

    /// @notice withdraw will transfer all of the sold nfts funds to owner of the contract.
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert NFT__WithdrawTransactionFailed();
        }
        emit Withdraw(amount, block.timestamp);
    }

    function getNftTokenUri() external view returns (string memory) {
        return _nftTokenUri;
    }

    function getMintFee() external view returns (uint256) {
        return _mintFee;
    }

    function getTokenCounter() external view returns (uint256) {
        return _tokenCounter;
    }
}
