import { Dispatch } from 'react';
import onboardingReducer from './features/Onboarding/slice';
import appReducer from './features/app/slice';
import chatReducer from './features/chats/slice';
import commonReducer from './features/common/slice';
import daoReducer from './features/dao/slice';
import discussionReducer from './features/discussion/slice';
import jobsSlice from './features/jobs/jobsSlice';
import jobsReducer from './features/jobs/slice';
import memberReducer from './features/members/slice';
import messageReducer from './features/messages/slice';
import notificationReducer from './features/notifications/slice';
import paymentsSlice from './features/payments/paymentsSlice';
import billingSlice from './features/billing/billingSlice';
import popupReducer from './features/popup/slice';
import projectSlice from './features/projects/projectSlice';
import projectsReducer from './features/projects/slice';
import userReducer from './features/user/slice';
import { daoApi } from './services/Dao/dao';
import { daoAnalyticsApi } from './services/DaoAnalytics/daoAnalytics';
import { dashboardApi } from './services/Dashboard/dashboard';
import { paymentsApi } from './services/payments/payments';
import { billingApi } from './services/Billing/billing';
import { tasksApi } from './services/projects/tasks';
import { userClansProfileApi } from './services/userProfile/clans';
import { userProfileApi } from './services/userProfile/userProfile';
import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { discoveryApi } from 'store/services/Discovery/Discovery';
import { discussionApi } from 'store/services/Discussion/discussion';
import { gifApi } from 'store/services/Gif/gif';
import { loginApi } from 'store/services/Login/login';
import { notificationsApi } from 'store/services/Notifications/Notifications';
import { searchApi } from 'store/services/Search/Search';
import { settingsApi } from 'store/services/Settings/settings';
import { jobsApi } from 'store/services/jobs/totalJobs';
import { projectApi } from 'store/services/projects/totalProjects';
import { EventAnalyticsPayload, sendEventAnalytics } from 'utils/activity/sendTrackingAnalytics';
import { sendbirdApi } from './services/SendBird/sendbirdApi';

require('dotenv').config();

export const postSuccessLoggerMiddleware =
    () =>
    (next: Dispatch<AnyAction>) =>
    <A extends AnyAction>(action: A) => {
        const analyticsPayload: EventAnalyticsPayload = {} as EventAnalyticsPayload;
        if (
            action.type.endsWith('/executeMutation/fulfilled') &&
            action.meta.requestStatus === 'fulfilled'
        ) {
            if (
                !(
                    action.meta.arg.endpointName === 'getMemberById' ||
                    action.meta.arg.endpointName === 'getProjectByMemberId'
                )
            ) {
                analyticsPayload.type = 'POST';
                analyticsPayload.endpoint = action.meta.baseQueryMeta.url;
                analyticsPayload.endpointName = action.meta.arg.endpointName;
                analyticsPayload.args = action.meta.arg.originalArgs;
                analyticsPayload.fulfilled = true;
                analyticsPayload.data = action.payload;
                sendEventAnalytics(analyticsPayload);
            }
        } else if (
            action.type.endsWith('/executeQuery/fulfilled') &&
            action.meta.requestStatus === 'fulfilled'
        ) {
            // analyticsPayload.type = 'GET';
            // analyticsPayload.endpoint = action.meta.baseQueryMeta.url;
            // analyticsPayload.endpointName = action.meta.arg.endpointName;
            // analyticsPayload.args = action.meta.arg.originalArgs;
            // analyticsPayload.fulfilled = true;
            // analyticsPayload.data = action.payload;
            // sendEventAnalytics(analyticsPayload);
            // console.log('Action Query fulfiled:', action);
        }

        return next(action);
    };

const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        popups: popupReducer,
        projects: projectsReducer,
        jobs: jobsReducer,
        projectsSlice: projectSlice,
        jobsSlice: jobsSlice,
        dao: daoReducer,
        commonReducer: commonReducer,
        chatReducer: chatReducer,
        onboardingReducer: onboardingReducer,
        payments: paymentsSlice,
        billing: billingSlice,
        notifications: notificationReducer,
        discussion: discussionReducer,
        messages: messageReducer,
        members: memberReducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [jobsApi.reducerPath]: jobsApi.reducer,
        [paymentsApi.reducerPath]: paymentsApi.reducer,
        [billingApi.reducerPath]: billingApi.reducer,
        [loginApi.reducerPath]: loginApi.reducer,
        [userProfileApi.reducerPath]: userProfileApi.reducer,
        [userClansProfileApi.reducerPath]: userClansProfileApi.reducer,
        [daoApi.reducerPath]: daoApi.reducer,
        [daoAnalyticsApi.reducerPath]: daoAnalyticsApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [settingsApi.reducerPath]: settingsApi.reducer,
        [discussionApi.reducerPath]: discussionApi.reducer,
        [tasksApi.reducerPath]: tasksApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
        [discoveryApi.reducerPath]: discoveryApi.reducer,
        [searchApi.reducerPath]: searchApi.reducer,
        [gifApi.reducerPath]: gifApi.reducer,
        [sendbirdApi.reducerPath]: sendbirdApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([
            // logger,
            postSuccessLoggerMiddleware,
            projectApi.middleware,
            jobsApi.middleware,
            paymentsApi.middleware,
            billingApi.middleware,
            loginApi.middleware,
            userProfileApi.middleware,
            userClansProfileApi.middleware,
            daoApi.middleware,
            daoAnalyticsApi.middleware,
            dashboardApi.middleware,
            settingsApi.middleware,
            discussionApi.middleware,
            tasksApi.middleware,
            notificationsApi.middleware,
            discoveryApi.middleware,
            searchApi.middleware,
            gifApi.middleware,
            sendbirdApi.middleware,
        ]),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
