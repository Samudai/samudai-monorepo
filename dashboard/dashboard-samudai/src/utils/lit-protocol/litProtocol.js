import LitJsSdk from '@lit-protocol/sdk-browser';
import axios from 'axios';
import store from 'store/store';
import { getAccessControls } from './helpers';

export const initLit = async (
    chain,
    typeOfGating,
    baseUrl,
    path,
    daoId,
    contractAddress,
    tokenId,
    value
) => {
    try {
        const accessControlConditions = getAccessControls(
            chain,
            typeOfGating,
            contractAddress,
            tokenId,
            value
        );
        console.log('accessControlConditions', accessControlConditions);
        const litNodeClient = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
        await litNodeClient.connect();

        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

        const resourceId = {
            baseUrl: baseUrl,
            path: path,
            orgId: daoId,
            role: '',
            extraData: '',
        };

        console.log(resourceId);

        await litNodeClient.saveSigningCondition({
            accessControlConditions,
            chain: chain,
            authSig,
            resourceId,
        });

        const jwt = await litNodeClient.getSignedToken({
            accessControlConditions,
            chain,
            authSig,
            resourceId,
        });

        if (jwt) {
            const result = await axios.post(
                `${process.env.REACT_APP_GATEWAY}api/web3/tokengating/add`,
                {
                    daoId: daoId,
                    resourceId: resourceId,
                    accessControlConditions: accessControlConditions[0],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                        daoid: store.getState().commonReducer.activeDao,
                    },
                }
            );
            console.log(result.data);
        }
        return jwt;
    } catch (err) {
        console.log(err);
    }
};

export const verifyLitAccess = async (daoId) => {
    try {
        const litNodeClient = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
        await litNodeClient.connect();

        const result = await axios.get(
            `${process.env.REACT_APP_GATEWAY}api/web3/tokengating/get/${daoId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    daoid: store.getState().commonReducer.activeDao,
                },
            }
        );

        console.log(result.data);

        const accessControlConditionsData = result.data.data.accessControlConditions[0];
        const accessControlConditions = [
            {
                contractAddress: accessControlConditionsData.contractAddress,
                standardContractType: accessControlConditionsData.standardContractType,
                chain: accessControlConditionsData.chain,
                method: accessControlConditionsData.method,
                parameters: accessControlConditionsData.parameters,
                returnValueTest: accessControlConditionsData.returnValueTest,
            },
        ];
        const resourceId = result.data.data.resourceId;
        const chain = accessControlConditions[0].chain;

        console.log({ accessControlConditions, resourceId, chain });

        const authSig = await LitJsSdk.checkAndSignAuthMessage({
            chain: accessControlConditionsData.chain,
        });
        const jwt = await litNodeClient.getSignedToken({
            accessControlConditions: accessControlConditions,
            chain: chain,
            authSig,
            resourceId: resourceId,
        });

        console.log(jwt);
        const { verfied, header, payload } = LitJsSdk.verifyJwt({ jwt });
        if (
            payload.baseUrl === window.location.origin &&
            payload.path === window.location.pathname &&
            payload.orgId === daoId
        ) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};
