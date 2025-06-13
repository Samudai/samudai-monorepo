import { CeramicClient } from '@ceramicnetwork/http-client';
import { JsonRpcSigner } from '@ethersproject/providers';
import { DID } from 'dids';
import { BigNumber, Wallet, utils } from 'ethers';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';

export const generateMessageForEntropy = (ethereum_address: string): string => {
    return (
        'Sign this message to generate your Samudai Identity for the following address \n' +
        ethereum_address +
        '\n This identity lets the application to authenticate to the Samudai \n' +
        '\n' +
        '\n' +
        'IMPORTANT: Only sign this message if you trust the application and the origin is https://app.samudai.xyz '
    );
};

const generateSignature = async (
    signer: JsonRpcSigner | Wallet,
    isPrivy?: boolean,
    signedTextRes?: string
) => {
    try {
        const userAddres: string = await signer.getAddress();
        const message: string = generateMessageForEntropy(userAddres);
        let signedText;
        if (isPrivy) {
            signedText = signedTextRes!;
        } else {
            signedText = await signer.signMessage(message);
        }
        const hash: any = utils.keccak256(signedText);
        const seed: any = hash
            // @ts-ignore
            .replace('0x', '')
            // @ts-ignore
            .match(/.{2}/g)
            .map((hexNoPrefix: any) => BigNumber.from('0x' + hexNoPrefix).toNumber());
        return seed;
    } catch (err) {
        console.error(err);
    }
};

export const ceramicInit = async (
    signer: JsonRpcSigner | Wallet,
    isPrivy?: boolean,
    signedTextRes?: string
): Promise<CeramicClient | null> => {
    try {
        const seed = await generateSignature(signer, isPrivy, signedTextRes);
        const provider = new Ed25519Provider(seed);
        // @ts-ignore
        const did = new DID({ provider, resolver: getResolver() });
        await did.authenticate();
        const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
        ceramic.did = did;
        return ceramic;
    } catch (err) {
        console.log(err);
        return null;
    }
};
