import { MemberResponse } from '@samudai_xyz/gateway-consumer-types';

export interface MemberSliceState {
    membersDetail: MemberResponse[];
    connectedMembersDetail: MemberResponse[];
}

export const initialState: MemberSliceState = {
    membersDetail: [],
    connectedMembersDetail: [],
};
