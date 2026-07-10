import { TokenGate } from './types';

const chainData: TokenGate[] = [
    {
        chain: {
            name: 'Ethereum',
        },
        token_type: [
            {
                name: 'ETH',
                requiredMinValue: true,
            },
            {
                name: 'ERC20',
                requiredMinValue: true,
                requiredContractAdderess: true,
            },
            {
                name: 'ERC721',
                requiredContractAdderess: true,
            },
            {
                name: 'ERC1155',
                requiredContractAdderess: true,
            },
        ],
    },
    {
        chain: {
            name: 'Polygon',
        },
        token_type: [],
    },
    {
        chain: {
            name: 'All the testnets for Ethereum',
        },
        token_type: [],
    },
];

export default chainData;
