import { Activity } from '@samudai_xyz/gateway-consumer-types/';
import axios from 'axios';
import store from 'store/store';

export enum RequestType {
    DAO = 'dao',
    PROJECT = 'project',
    TASK = 'task',
    DEAL = 'deal',
    MEMBER = 'member',
}

export const sendActivityUpdate = async (activityData: Activity) => {
    const url = `${process.env.REACT_APP_GATEWAY}api/activity/add`;

    const res = await axios.post(
        url,
        { activity: activityData },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                daoid: store.getState().commonReducer.activeDao,
            },
        }
    );
    console.log('send activity', res);
};
