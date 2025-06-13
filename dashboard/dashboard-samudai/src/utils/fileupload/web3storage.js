import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

export const makeStorage = () => {
    return new Web3Storage({ token: process.env.REACT_APP_WEB3SSTORAGE });
};
