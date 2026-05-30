export const getAccessControls = (
    chain: string,
    typeOfGating: string,
    contractAddress?: string,
    tokenId?: string,
    value?: string
) => {
    let accessControlConditions;

    if (typeOfGating === 'ERC20') {
        accessControlConditions = [
            {
                contractAddress: contractAddress,
                standardContractType: 'ERC20',
                chain,
                method: 'balanceOf',
                parameters: [':userAddress'],
                returnValueTest: {
                    comparator: '>',
                    value: value,
                },
            },
        ];
    } else if (typeOfGating === 'ERC721') {
        if (tokenId) {
            accessControlConditions = [
                {
                    contractAddress: contractAddress,
                    standardContractType: 'ERC721',
                    chain,
                    method: 'ownerOf',
                    parameters: [tokenId],
                    returnValueTest: {
                        comparator: '=',
                        value: ':userAddress',
                    },
                },
            ];
        } else {
            accessControlConditions = [
                {
                    contractAddress: contractAddress,
                    standardContractType: 'ERC721',
                    chain,
                    method: 'balanceOf',
                    parameters: [':userAddress'],
                    returnValueTest: {
                        comparator: '>',
                        value: '0',
                    },
                },
            ];
        }
    } else if (typeOfGating === 'ERC1155') {
        if (tokenId) {
            accessControlConditions = [
                {
                    contractAddress: contractAddress,
                    standardContractType: 'ERC1155',
                    chain,
                    method: 'balanceOf',
                    parameters: [':userAddress', tokenId],
                    returnValueTest: {
                        comparator: '>',
                        value: value,
                    },
                },
            ];
        } else {
            accessControlConditions = [
                {
                    contractAddress: contractAddress,
                    standardContractType: 'ERC1155',
                    chain,
                    method: 'balanceOf',
                    parameters: [':userAddress'],
                    returnValueTest: {
                        comparator: '>',
                        value: value,
                    },
                },
            ];
        }
    } else if (typeOfGating === 'ETH') {
        accessControlConditions = [
            {
                contractAddress: '',
                standardContractType: '',
                chain,
                method: 'eth_getBalance',
                parameters: [':userAddress', 'latest'],
                returnValueTest: {
                    comparator: '>=',
                    value: value,
                },
            },
        ];
    }

    return accessControlConditions;
};
