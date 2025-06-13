import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import { Provider } from '@samudai_xyz/gateway-consumer-types/dist/types/payment/types';
import { IChainList } from 'store/services/payments/model';
import { RootState } from 'store/store';
import { GnosisTypes } from '@samudai_xyz/web3-sdk';

interface IInitialState {
    provider: Provider[];
    wallet: Provider[];
    chainList: IChainList[];
    defaultProvider?: Provider;
    safeOwners: string[];
    refetch: boolean;
    memberData: Record<string, MemberResponse>;
    tokens: Record<string, GnosisTypes.WidgetBalance[]>;
}

const initialState: IInitialState = {
    provider: [],
    wallet: [],
    chainList: [],
    safeOwners: [],
    refetch: false,
    memberData: {},
    tokens: {},
};

export const paymentsSlice = createSlice({
    name: 'paymentsSlice',
    initialState,
    reducers: {
        addProvider: (state, action: PayloadAction<Provider[]>) => {
            state.provider = [];
            state.provider.push(...action.payload);
        },
        addWallet: (state, action: PayloadAction<Provider[]>) => {
            state.wallet = [];
            state.wallet.push(...action.payload);
        },
        addChainList: (state, action: PayloadAction<IChainList[]>) => {
            state.chainList.push(...action.payload);
        },
        addDefaultProvider: (state, action: PayloadAction<Provider>) => {
            state.defaultProvider = action.payload;
        },
        addSafeOwners: (state, action: PayloadAction<string[]>) => {
            state.safeOwners = action.payload;
        },
        setRefetch: (state, action: PayloadAction<boolean>) => {
            state.refetch = action.payload;
        },
        addMemberData: (state, action: PayloadAction<Record<string, MemberResponse>>) => {
            state.memberData = action.payload;
        },
        addTokens: (state, action: PayloadAction<Record<string, GnosisTypes.WidgetBalance[]>>) => {
            state.tokens = action.payload;
        },
    },
});

export const providerList = (state: RootState) => state.payments.provider;
export const walletList = (state: RootState) => state.payments.wallet;
export const chainList = (state: RootState) => state.payments.chainList;
export const selectDefaultProvider = (state: RootState) => state.payments.defaultProvider;
export const selectSafeOwners = (state: RootState) => state.payments.safeOwners;
export const selectRefetch = (state: RootState) => state.payments.refetch;
export const selectMemberData = (state: RootState) => state.payments.memberData;
export const selectTokens = (state: RootState) => state.payments.tokens;
export const {
    addProvider,
    addWallet,
    addChainList,
    addDefaultProvider,
    addSafeOwners,
    setRefetch,
    addMemberData,
    addTokens,
} = paymentsSlice.actions;
export default paymentsSlice.reducer;
