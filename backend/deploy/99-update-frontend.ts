import { DeployFunction } from "hardhat-deploy/dist/types";
import fs from "fs";
import { ethers, network } from "hardhat";
import { NFT } from "../typechain-types";

const FRONTEND_CONTRACT_ADDRESSES_FILE_PATH: string =
    "../frontend/src/constants/contractAddresses.json";
const FRONTEND_ABI_FILE_PATH: string = "../frontend/src/constants/abi.json";

const updateFrontendFunction: DeployFunction = async () => {
    if (process.env.UPDATE_FRONTEND == "true") {
        console.log("Updating the frontend...");
        await updateContractAddresses();
        await updateAbi();
        console.log("Done!");
    }
};

async function updateAbi() {
    const nft = await ethers.getContract("NFT");

    fs.writeFileSync(
        FRONTEND_ABI_FILE_PATH,
        JSON.parse(
            JSON.stringify(nft.interface.format(ethers.utils.FormatTypes.json))
        )
    );
}

async function updateContractAddresses() {
    // * get the contract.
    const nft: NFT = await ethers.getContract("NFT");
    // * read the contracts array file from frontend (check the location twice).
    const contractAddresses = JSON.parse(
        fs.readFileSync(FRONTEND_CONTRACT_ADDRESSES_FILE_PATH, "utf-8")
    );
    // * read the chainId.
    const chainId: string | undefined = network.config.chainId?.toString();

    // * if chainId is undefined show the message.
    if (chainId != undefined) {
        // * check whether the chainId already exist in array or not.
        if (chainId in contractAddresses) {
            // * if yes then check whether the array already contains the address or not.
            if (
                !contractAddresses[network.config.chainId!].includes(
                    nft.address
                )
            ) {
                // * if not then push this new address to existing addresses of contract.
                contractAddresses[network.config.chainId!].push(nft.address);
            }
        } else {
            // * if not then create the new array of contract addresses.
            contractAddresses[network.config.chainId!] = [nft.address];
        }
        fs.writeFileSync(
            FRONTEND_CONTRACT_ADDRESSES_FILE_PATH,
            JSON.stringify(contractAddresses)
        );
    } else {
        console.log(
            `ChainId is undefined, here is the value of it: ${chainId}`
        );
    }
}

export default updateFrontendFunction;
updateFrontendFunction.tags = ["all", "frontend"];
