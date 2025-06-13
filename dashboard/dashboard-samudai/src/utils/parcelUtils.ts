import { Auth } from '@samudai_xyz/gateway-consumer-types';
import { ethers } from 'ethers';

export const parcelSign = async (provider: ethers.providers.Web3Provider): Promise<Auth> => {
    console.log(provider);
    const signer = provider.getSigner();
    const message = `Allow third party app to access your data on Parcel ${Date.now()}`;
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
    const auth: Auth = {
        walletAddress: address,
        auth_msg: message,
        signature,
    };
    return auth;
};
