export interface networkConfigItem {
    mintFee: string;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    31337: {
        mintFee: "10000000000000000", // 0.01 ETH
    },
    5: {
        mintFee: "10000000000000000", // 0.01 ETH
    },
};

export const developmentChains: string[] = ["hardhat", "localhost"];
