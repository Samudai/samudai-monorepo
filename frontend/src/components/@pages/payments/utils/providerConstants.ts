export interface IProviderList {
    id: number;
    name: string;
    value: string;
}

export interface IChainList {
    id: number;
    network: string;
    name: string;
    chain_id: number;
    type: string;
    currency: string;
    value: string;
}

export const providerValues = [
    { id: 1, name: 'gnosis', value: 'gnosis' },
    // { id: 2, name: 'parcel', value: 'parcel' },
];

export const GnosisChainValues: IChainList[] = [
    {
        id: 10,
        network: 'EVM',
        name: 'Ethereum',
        chain_id: 1,
        type: 'mainnet',
        currency: 'ETH',
        value: 'Ethereum',
    },
    {
        id: 13,
        network: 'EVM',
        name: 'Polygon',
        chain_id: 137,
        type: 'mainnet',
        currency: 'MATIC',
        value: 'Polygon',
    },
    {
        id: 17,
        network: 'EVM',
        name: 'Goerli',
        chain_id: 5,
        type: 'testnet',
        currency: 'GOR',
        value: 'Goerli',
    },
];
export const ParcelChainValues: IChainList[] = [
    {
        id: 10,
        network: 'EVM',
        name: 'Ethereum',
        chain_id: 1,
        type: 'mainnet',
        currency: 'ETH',
        value: 'Ethereum',
    },
];
