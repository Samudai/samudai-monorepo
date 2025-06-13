import { Alchemy, Network } from 'alchemy-sdk';

const configEth = {
    apiKey: `${process.env.REACT_APP_ALCHEMY_ETHEREUM}`,
    network: Network.ETH_MAINNET,
};

const configPolygon = {
    apiKey: `${process.env.REACT_APP_ALCHEMY_POLYGON}`,
    network: Network.ETH_MAINNET,
};

const configOptimism = {
    apiKey: `${process.env.REACT_APP_ALCHEMY_OPTIMISM}`,
    network: Network.ETH_MAINNET,
};

const configArbitrum = {
    apiKey: `${process.env.REACT_APP_ALCHEMY_ARBITRUM}`,
    network: Network.ETH_MAINNET,
};

export const alchemy = (chain_id: number) => {
    const chainId = chain_id || '1';
    const config = () => {
        switch (chainId) {
            case 1:
                return configEth;
            case 137:
                return configPolygon;
            case 10:
                return configOptimism;
            case 42161:
                return configArbitrum;
            default:
                return configEth;
        }
    };
    const alchemy = new Alchemy(config());
    return alchemy;
};
