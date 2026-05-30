export interface IProviderList {
    id: number;
    name: string;
    chain_id?: number;
}
export const providerValues = [
    { id: 0, name: 'Please Select Provider', value: '' },
    { id: 1, name: 'gnosis', value: 'gnosis' },
    // { id: 2, name: 'parcel', value: 'parcel' },
    // { id: 3, name: 'wallet', value: 'wallet' },
];

export const chainMap: any = {
    '137': {
        name: 'Polygon',
        url: 'https://polygonscan.com/tx/',
    },
    '1': {
        name: 'Mainnet',
        url: 'https://etherscan.io/tx/',
    },
    '5': {
        name: 'Goerli',
        url: 'https://goerli.etherscan.io/tx/',
    },
};

export const goToURL = (chain: number, hash: string) => `${chainMap[chain.toString()].url}${hash}`;
