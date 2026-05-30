import { Alchemy, Network, TokenMetadataResponse } from 'alchemy-sdk';

const settingsConfig = [
    {
        name: 'ethereum',
        settings: {
            apiKey: '93abA8Tod5wqSRnXxJvYnD3_gAyMSBX3',
            network: Network.ETH_MAINNET,
        },
    },
    {
        name: 'polygon',
        settings: {
            apiKey: '93abA8Tod5wqSRnXxJvYnD3_gAyMSBX3',
            network: Network.MATIC_MAINNET,
        },
    },
    {
        name: 'goerli',
        settings: {
            apiKey: '93abA8Tod5wqSRnXxJvYnD3_gAyMSBX3',
            network: Network.ETH_GOERLI,
        },
    },
];

export const getTokenDetails = async (
    tokenAddress: string,
    network: string
): Promise<TokenMetadataResponse> => {
    const networkSetting = settingsConfig.find((setting) => setting.name === network);
    const alchemy = new Alchemy(networkSetting?.settings);
    const token = await alchemy.core.getTokenMetadata(tokenAddress);
    return token;
};
