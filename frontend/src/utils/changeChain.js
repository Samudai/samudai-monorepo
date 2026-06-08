import store from 'store/store';
import { toast } from './toast';

export const swichNetwork = async (chainId) => {
    const providerEth = store.getState().commonReducer.provider;
    let currentChainId = await providerEth.getNetwork().then((network) => network.chainId);

    if (currentChainId !== chainId) {
        try {
            await providerEth.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: 1 }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                toast('Failure', 5000, 'add this chain id', '');
            }
        }
    }
};
