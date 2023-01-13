import { ethers, getNamedAccounts } from "hardhat";
import { NFT } from "../typechain-types";
import { BigNumber, ContractTransaction } from "ethers";

const mintFee: BigNumber = ethers.utils.parseEther("0.01");

async function mintNft(): Promise<void> {
    const { deployer } = await getNamedAccounts();

    const nft: NFT = await ethers.getContract("NFT", deployer);
    console.log(`NFT contract addresss: ${nft.address}`);

    // * get the nft token id.
    const tokenId = await nft.getTokenCounter();

    const tx: ContractTransaction = await nft.mintNft({ value: mintFee });
    await tx.wait(1);

    console.log(
        `NFT minted successfully. You can view the NFT of Opensea testnet: https://testnets.opensea.io/assets/goerli/${nft.address}/${tokenId}`
    );
}

mintNft()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
