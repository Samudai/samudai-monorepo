import { ethers } from 'ethers';

export const generateMessageEntropy = (username: string) => {
    const data = JSON.stringify({
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
            ],
            Permit: [{ name: 'username', type: 'string' }],
        },
        domain: {
            name: 'Sybil Verifier',
            version: '1',
        },
        primaryType: 'Permit',
        message: {
            username: username,
        },
    });
    return data;
};

export const getTweetMessage = (
    username: string,
    signature: string,
    address: string,
    dao?: string
) => {
    const tweetMessage = dao
        ? `${dao} have onboarded on Samudai for our DAO operations management
    addr:${address}
    sig:${signature ?? ''}`
        : `Hello Folks 👋, I have signed up on Samudai as a contributor
     addr:${address}
    sig:${signature ?? ''}`;
    return tweetMessage;
};

export const generateTweetSignature = async (
    username: string,
    provider: ethers.providers.Web3Provider,
    dao?: string
) => {
    try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const message = generateMessageEntropy(username);
        const signature = await signer.signMessage(message);
        const tweetMessage = getTweetMessage(username, signature, address, dao);
        console.log(tweetMessage);
        return tweetMessage;
    } catch (err) {
        console.log(err);
    }
};
