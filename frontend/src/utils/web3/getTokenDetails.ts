import { Alchemy, Network, TokenMetadataResponse } from 'alchemy-sdk';

// Alchemy apps are multichain by default: one API key serves every network.
const apiKey = process.env.REACT_APP_ALCHEMY_API_KEY;

const settingsConfig = [
    {
        name: 'ethereum',
        settings: {
            apiKey,
            network: Network.ETH_MAINNET,
        },
    },
    {
        name: 'polygon',
        settings: {
            apiKey,
            network: Network.MATIC_MAINNET,
        },
    },
    {
        name: 'sepolia',
        settings: {
            apiKey,
            network: Network.ETH_SEPOLIA,
        },
    },
];

export const getTokenDetails = async (
    tokenAddress: string,
    network: string
): Promise<TokenMetadataResponse> => {
    const networkSetting = settingsConfig.find((setting) => setting.name === network);
    if (!networkSetting) {
        throw new Error(`Unsupported network: ${network}`);
    }
    const alchemy = new Alchemy(networkSetting.settings);
    const token = await alchemy.core.getTokenMetadata(tokenAddress);
    return token;
};
