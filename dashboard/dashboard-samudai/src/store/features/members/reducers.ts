import { PayloadAction } from '@reduxjs/toolkit';
import { MemberSliceState } from './state';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types';

const reducers = {
    addMember: (state: MemberSliceState, { payload }: PayloadAction<MemberResponse>) => {
        state.membersDetail.push({ ...payload });
    },
    addMembers: (state: MemberSliceState, { payload }: PayloadAction<MemberResponse[]>) => {
        state.membersDetail = [...payload];
    },
    addConnectedMembers: (
        state: MemberSliceState,
        { payload }: PayloadAction<MemberResponse[]>
    ) => {
        state.connectedMembersDetail = [...payload];
    },
};

export default reducers;
