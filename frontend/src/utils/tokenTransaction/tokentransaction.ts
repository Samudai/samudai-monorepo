import abi from './transfer.json';
import { ethers } from 'ethers';

export const tokenTransaction = async (
    provider: ethers.providers.Web3Provider,
    value: string,
    to: string,
    token_address: string
) => {
    console.log(value);
    try {
        if (token_address !== '') {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(token_address, abi, signer);
            const tx = await contract.transfer(to, ethers.utils.parseEther(value));
            return tx?.hash;
        } else {
            const tx = {
                to: to,
                value: ethers.utils.parseEther(value),
            };
            const signer = provider.getSigner();
            const res = await signer?.sendTransaction(tx);
            const hash = res?.hash || '';

            return hash;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};
