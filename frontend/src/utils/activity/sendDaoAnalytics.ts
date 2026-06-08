import axios from 'axios';
import store from 'store/store';

export type AnalyticsRequest = {
    dao_id: string;
    member_id: string;
};

export const sendDaoAnalytics = async (data: AnalyticsRequest, _type?: string, _extras?: any) => {
    const url = `${import.meta.env.REACT_APP_GATEWAY}api/dao/analytics/dao/add`;

    await axios.post(
        url,
        { analytics: { ...data } },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                daoid: store.getState().commonReducer.activeDao,
            },
        }
    );
};
