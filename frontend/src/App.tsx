import { ConnectButton } from "@web3uikit/web3";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect } from "react";
import { ContractTransaction, ethers } from "ethers";
import "./App.css";

import { contractAddresses, abi } from "./constants";
import { AiFillBell } from "react-icons/ai";
import { useNotification } from "@web3uikit/core";

interface contractAddressesInterface {
    [key: string]: string[];
}

function App() {
    const addresses: contractAddressesInterface = contractAddresses;
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    const nftContractAddress =
        chainId in addresses ? addresses[chainId][0] : null;

    const dispatch = useNotification();

    const { runContractFunction: mintNft } = useWeb3Contract({
        abi: abi,
        contractAddress: nftContractAddress!,
        functionName: "mintNft",
        msgValue: ethers.utils.parseEther("0.01").toString(),
    });

    useEffect(() => {}, [isWeb3Enabled]);

    async function handleOnMint(): Promise<void> {
        await mintNft({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => {
                dispatch({
                    type: "error",
                    title: error.name,
                    message: error.message,
                    icon: <AiFillBell />,
                    position: "topR",
                });
            },
        });
    }

    async function handleSuccess(tx: ContractTransaction): Promise<void> {
        await tx.wait(1);
        alert("success");
    }

    return (
        <div className="flex flex-col justify-start items-center h-screen">
            <div className="flex items-center mt-12 w-full">
                <div className="w-1/3"></div>
                <h1 className="font-extrabold text-transparent text-7xl bg-clip-text bg-gradient-to-r from-[rgb(96,198,87)] to-[#35aee2]">
                    Gold Sonic Cat
                </h1>
                <div className="ml-auto mr-8">
                    <ConnectButton />
                </div>
            </div>
            <h2 className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-[#60c657] to-[#35aee2] w-fit mt-4">
                NFT Collection
            </h2>
            <h3 className="w-fit text-white font-extrabold text-2xl mt-2">
                Mint Yours Now!
            </h3>
            <div className="mt-36 text-white">
                {isWeb3Enabled ? (
                    nftContractAddress ? (
                        <button
                            onClick={handleOnMint}
                            className="bg-gradient-to-r from-[#60c657] to-[#35aee2] px-24 py-4 text-xl text-white font-bold rounded-lg"
                        >
                            Mint
                        </button>
                    ) : (
                        <p>
                            This network is not supported, please switch to
                            supported networks. Supported networks are Hardhat
                            Localhost and Ethereum Goerli Network.
                        </p>
                    )
                ) : (
                    <p>Connect your Wallet first</p>
                )}
            </div>
        </div>
    );
}

export default App;
