import { Alchemy, Network } from 'alchemy-sdk';

// Alchemy apps are multichain by default: one API key serves every network.
const apiKey = import.meta.env.REACT_APP_ALCHEMY_API_KEY;

const configEth = {
    apiKey,
    network: Network.ETH_MAINNET,
};

const configPolygon = {
    apiKey,
    network: Network.MATIC_MAINNET,
};

const configOptimism = {
    apiKey,
    network: Network.OPT_MAINNET,
};

const configArbitrum = {
    apiKey,
    network: Network.ARB_MAINNET,
};

export const alchemy = (chain_id: number) => {
    const chainId = chain_id || 1;
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
