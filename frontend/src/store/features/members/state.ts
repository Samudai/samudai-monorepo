import { MemberResponse } from '@samudai/gateway-consumer-types';

export interface MemberSliceState {
    membersDetail: MemberResponse[];
    connectedMembersDetail: MemberResponse[];
}

export const initialState: MemberSliceState = {
    membersDetail: [],
    connectedMembersDetail: [],
};
