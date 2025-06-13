import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { IPayoutRequest } from 'store/services/projects/model';

export interface ProjectSliceState {
    projects: ProjectResponse[];
    payouts: IPayoutRequest[];
    projectDaoId?: string;
}

export const initialState: ProjectSliceState = {
    projects: [],
    payouts: [],
};
