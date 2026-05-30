import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import reducers from './reducer';
import { initialState } from './state';

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers,
});

export const selectActiveDao = (state: RootState) => state.commonReducer.activeDao;
export const selectActiveDaoName = (state: RootState) => state.commonReducer.activeDaoName;
export const selectDaoList = (state: RootState) => state.commonReducer.daoList;
export const selectProvider = (state: RootState) => state.commonReducer.provider;
export const selectWallet = (state: RootState) => state.commonReducer.provider;
export const selectAccount = (state: RootState) => state.commonReducer.account;
export const selectJwt = (state: RootState) => state.commonReducer.jwt;
export const selectRoles = (state: RootState) => state.commonReducer.roles;
export const selectProfilePicture = (state: RootState) => state.commonReducer.profilePicture;
export const selectGcal = (state: RootState) => state.commonReducer.gcal;
export const selectSnapshot = (state: RootState) => state.commonReducer.snapshot;
export const selectDropdown = (state: RootState) => state.commonReducer.dropdown;
export const selectNotionProject = (state: RootState) => state.commonReducer.notionProject;
export const selectAccess = (state: RootState) => state.commonReducer.access;
export const selectProjectid = (state: RootState) => state.commonReducer.projectid;
export const selectNotion = (state: RootState) => state.commonReducer.notion;
export const selectTokenGating = (state: RootState) => state.commonReducer.token_gating;
export const selectTokenVal = (state: RootState) => state.commonReducer.token_val;
export const selectTaskid = (state: RootState) => state.commonReducer.taskid;
export const selectUserName = (state: RootState) => state.commonReducer.userName;
export const selectShowSettings = (state: RootState) => state.commonReducer.showSettings;
export const selectStreamId = (state: RootState) => state.commonReducer.streamId;
export const selectGuildId = (state: RootState) => state.commonReducer.guildId;
export const selectSocket = (state: RootState) => state.commonReducer.socket;
export const selectPushSDKSocket = (state: RootState) => state.commonReducer.pushSDKSocket;
export const selectUrl = (state: RootState) => state.commonReducer.url;
export const selectDiscordLoader = (state: RootState) => state.commonReducer.discordLoader;
export const selectWeb3ModalProvider = (state: RootState) => state.commonReducer.web3ModalProvider;
export const selectDaoid = (state: RootState) => state.commonReducer.daoid;
export const selectMember = (state: RootState) => state.commonReducer.member;
export const selectMemberData = (state: RootState) => state.commonReducer.member?.data;
export const selectMemberUsername = (state: RootState) => state.commonReducer.member?.data.username;
export const selectMemberEmail = (state: RootState) => state.commonReducer.member?.data?.email;
export const selectMemberProfilePicture = (state: RootState) =>
    state.commonReducer.member?.data.profile_picture;
export const selectMemberConnections = (state: RootState) =>
    state.commonReducer.member?.connections;
export const selectGnosis = (state: RootState) => state.commonReducer.gnosis;
export const selectEventPopUp = (state: RootState) => state.commonReducer.eventPopUp;
export const selectReviewsData = (state: RootState) => state.commonReducer.reviewsData;
export const selectPaymentsData = (state: RootState) => state.commonReducer.paymentsData;
export const selectTwitterData = (state: RootState) => state.commonReducer.twitterdata;
export const selectPinnedProjects = (state: RootState) => state.commonReducer.pinnedProjects;
export const selectAccessList = (state: RootState) => state.commonReducer.accessList;
export const selectCreateEvent = (state: RootState) => state.commonReducer.createEvent;
export const selectProjectDao = (state: RootState) => state.commonReducer.projectDao;
export const selectTokenCurrency = (state: RootState) => state.commonReducer.tokenCurrency;
export const selectDaoProgress = (state: RootState) => state.commonReducer.daoProgress;
export const selectContributorProgress = (state: RootState) =>
    state.commonReducer.contributorProgress;
export const selectDaoSubdomainClaimed = (state: RootState) =>
    state.commonReducer.daoSubdomainClaimed;
export const selectMemberSubdomainClaimed = (state: RootState) =>
    state.commonReducer.memberSubdomainClaimed;
export const loginModalState = (state: RootState) => state.commonReducer.loginModal;
export const tutorialStep = (state: RootState) => state.commonReducer.tutorialStep;
export const addedDao = (state: RootState) => state.commonReducer.addedDao;
export const selectBillingTier = (state: RootState) => state.commonReducer.billingPriceTier;
export const selectBillingTerm = (state: RootState) => state.commonReducer.billingTerm;
export const {
    changeActiveDao,
    changeActiveDaoName,
    changeDaoList,
    changeProvider,
    changeWallet,
    changeAccount,
    changeJwt,
    changeRoles,
    changeProfilePicture,
    changeGcal,
    changeSnapshot,
    changeDropdown,
    changeNotionProject,
    changeAccess,
    changeProjectid,
    changeNotion,
    changeTokenGating,
    changeTokenVal,
    changeTaskid,
    changeUserName,
    changeShowSettings,
    changeStreamId,
    changeGuildId,
    setNotificationSocket,
    setPushNotificationSocket,
    changeUrl,
    changeDiscordLoader,
    changeWeb3ModalProvider,
    changeDaoId,
    setMemberData,
    changeGnosis,
    setEventPopUp,
    changeReviewsData,
    changePaymentsData,
    changeTwitterData,
    addPinnedProject,
    removePinnedProject,
    changeAccessList,
    createEventPopUp,
    changeProjectDao,
    addPinnedProjectBulk,
    changeTokenCurrency,
    changeDaoProgress,
    changeContributorProgress,
    changeDaoSubdomainClaimed,
    changeMemberSubdomainClaimed,
    openLoginModal,
    changeTutorialStep,
    changeAddedDao,
    changeBillingTerm,
    changeBillingTier,
} = commonSlice.actions;

export default commonSlice.reducer;
