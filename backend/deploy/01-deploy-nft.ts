import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { network } from "hardhat";
import verify from "../utils/verify";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployNFTContract: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;

    // * specify the nft metadata uri ipfs hash.
    const metadataIpfsHash: string = "";

    if (metadataIpfsHash == "") {
        throw "Specify the hash of the metadata.";
    }

    const nftUri: string = `ipfs://${metadataIpfsHash}`;
    const nftName: string = "Gold Sonic Cat";
    const nftSymbol: string = "GSC";
    const mintFee: string = networkConfig[chainId]["mintFee"];

    const args = [nftUri, nftName, nftSymbol, mintFee];

    const nft: DeployResult = await deploy("NFT", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });

    // * only verify on testnets or mainnets.
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(nft.address, args);
    }
};

export default deployNFTContract;
deployNFTContract.tags = ["all", "nft"];
