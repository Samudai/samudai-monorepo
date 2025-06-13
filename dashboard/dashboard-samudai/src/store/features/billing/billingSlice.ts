import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { Subscription } from '@samudai_xyz/gateway-consumer-types';
import { usedLimitCount } from 'store/services/Billing/model';

interface IInitialState {
    billingUrl?: string;
    usedLimitCount?: usedLimitCount;
    currSubscription?: Subscription;
    currBillingDao?: string;
}

const initialState: IInitialState = {};

export const billingSlice = createSlice({
    name: 'billingSlice',
    initialState,
    reducers: {
        addBillingUrl: (state, action: PayloadAction<string>) => {
            state.billingUrl = action.payload;
        },
        addCurrSubscription: (state, action: PayloadAction<Subscription>) => {
            state.currSubscription = action.payload;
        },
        addUsedLimitCount: (state, action: PayloadAction<usedLimitCount>) => {
            state.usedLimitCount = action.payload;
        },
        updateCurrBillingDao: (state, action: PayloadAction<string>) => {
            state.currBillingDao = action.payload;
        },
    },
});

export const selectBillingUrl = (state: RootState) => state.billing.billingUrl;
export const selectUsedLimitCount = (state: RootState) => state.billing.usedLimitCount;
export const selectCurrSubscription = (state: RootState) => state.billing.currSubscription;
export const selectCurrBillingDao = (state: RootState) => state.billing.currBillingDao;

export const { addBillingUrl, addUsedLimitCount, addCurrSubscription, updateCurrBillingDao } =
    billingSlice.actions;
export default billingSlice.reducer;
