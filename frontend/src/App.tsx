import { ConnectButton } from "@web3uikit/web3";
import "./App.css";

function App() {
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
            <button className="bg-gradient-to-r from-[#60c657] to-[#35aee2] px-24 py-4 text-xl text-white font-bold rounded-lg mt-32">
                Mint
            </button>
        </div>
    );
}

export default App;
