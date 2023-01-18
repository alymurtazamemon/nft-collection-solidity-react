import { ConnectButton } from "@web3uikit/web3";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { ContractInterface, ContractTransaction, ethers } from "ethers";
import "./App.css";

import { contractAddresses, abi } from "./constants";
import { AiFillBell } from "react-icons/ai";
import { Loading, useNotification } from "@web3uikit/core";

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

    let [loading, setLoading] = useState(false);

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
        // console.log("success");
        await tx.wait(1);
        listenEvent();
    }

    function timeout(delay: number) {
        return new Promise((res) => setTimeout(res, delay));
    }

    async function listenEvent() {
        // console.log("listening");
        setLoading(true);

        // * add a waiting delay for hardhat network.
        if (chainId == "31337") {
            await timeout(10000);
        }

        try {
            const { ethereum } = window as any;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(
                    nftContractAddress!,
                    abi as ContractInterface,
                    signer
                );

                connectedContract.once("NFTMinted", (from, tokenId, value) => {
                    alert(
                        `NFT minted successfully. You can view the NFT on Opensea testnet: https://testnets.opensea.io/assets/goerli/${nftContractAddress}/${tokenId}`
                    );
                });

                // console.log("done");
                setLoading(false);
            }
        } catch (error) {
            // console.log(error);
            alert(error);
        }
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
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handleOnMint}
                                className="bg-gradient-to-r from-[#60c657] to-[#35aee2] px-24 py-4 text-xl text-white font-bold rounded-lg mb-24"
                            >
                                Mint
                            </button>
                            {loading && (
                                <Loading
                                    direction="bottom"
                                    fontSize={16}
                                    size={12}
                                    spinnerColor="#35aee2"
                                    spinnerType="wave"
                                    text="Transaction pending..."
                                />
                            )}
                        </div>
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
