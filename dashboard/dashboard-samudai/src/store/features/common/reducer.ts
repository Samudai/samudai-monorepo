import { PayloadAction } from '@reduxjs/toolkit';
import { WebNotification } from '@samudai_xyz/gateway-consumer-types';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types/';
import { ethers } from 'ethers';
import { Socket } from 'socket.io-client';
import { CommonSliceState } from './state';
import { DAOType } from 'root/mockup/daos';
import {
    NewContributorItems,
    NewDAOItems,
} from '@samudai_xyz/gateway-consumer-types/dist/types/activity/enums';

const reducers = {
    changeActiveDao: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ activeDao: string }>
    ) => {
        state.activeDao = payload.activeDao;
    },
    changeActiveDaoName: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ activeDaoName: string }>
    ) => {
        state.activeDaoName = payload.activeDaoName;
    },
    changeDaoList: (state: CommonSliceState, { payload }: PayloadAction<{ list: DAOType[] }>) => {
        state.daoList = payload.list;
    },
    changeProvider: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ provider: ethers.providers.Web3Provider }>
    ) => {
        state.provider = payload.provider;
    },
    changeWallet: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ wallet: ethers.Wallet }>
    ) => {
        state.wallet = payload.wallet;
    },
    changeAccount: (state: CommonSliceState, { payload }: PayloadAction<{ account: string }>) => {
        state.account = payload.account;
    },
    changeJwt: (state: CommonSliceState, { payload }: PayloadAction<{ jwt: string }>) => {
        state.jwt = payload.jwt;
    },
    changeRoles: (state: CommonSliceState, { payload }: PayloadAction<{ roles: string[] }>) => {
        state.roles = payload.roles;
    },
    changeProfilePicture: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ profilePicture: string }>
    ) => {
        state.profilePicture = payload.profilePicture;
    },
    changeGcal: (state: CommonSliceState, { payload }: PayloadAction<{ gcal: boolean }>) => {
        state.gcal = payload.gcal;
    },
    changeSnapshot: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ snapshot: boolean }>
    ) => {
        state.snapshot = payload.snapshot;
    },
    changeGnosis: (state: CommonSliceState, { payload }: PayloadAction<{ gnosis: boolean }>) => {
        state.gnosis = payload.gnosis;
    },
    changeDropdown: (state: CommonSliceState, { payload }: PayloadAction<{ dropdown: any }>) => {
        state.dropdown = payload.dropdown;
    },
    changeNotionProject: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ notionProject: any }>
    ) => {
        state.notionProject = payload.notionProject;
    },
    changeAccess: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ access: AccessEnums.AccessType[] }>
    ) => {
        state.access = payload.access;
    },
    changeProjectid: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ projectid: string }>
    ) => {
        state.projectid = payload.projectid;
    },
    changeNotion: (state: CommonSliceState, { payload }: PayloadAction<{ notion: boolean }>) => {
        state.notion = payload.notion;
    },
    changeTokenGating: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ token_gating: boolean }>
    ) => {
        state.token_gating = payload.token_gating;
    },
    changeTokenVal: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ token_val: string }>
    ) => {
        state.token_val = payload.token_val;
    },
    changeTaskid: (state: CommonSliceState, { payload }: PayloadAction<{ taskid: string }>) => {
        state.taskid = payload.taskid;
    },
    changeUserName: (state: CommonSliceState, { payload }: PayloadAction<{ userName: string }>) => {
        state.userName = payload.userName;
    },
    changeShowSettings: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ showSettings: boolean }>
    ) => {
        state.showSettings = payload.showSettings;
    },
    changeStreamId: (state: CommonSliceState, { payload }: PayloadAction<{ streamId: string }>) => {
        state.streamId = payload.streamId;
    },
    changeGuildId: (state: CommonSliceState, { payload }: PayloadAction<{ guildId: string }>) => {
        state.guildId = payload.guildId;
    },
    setNotificationSocket: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ socket: Socket }>
    ) => {
        state.socket = payload.socket;
    },
    setPushNotificationSocket: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ pushSDKSocket: Socket }>
    ) => {
        state.pushSDKSocket = payload.pushSDKSocket;
    },
    changeUrl: (state: CommonSliceState, { payload }: PayloadAction<{ url: string }>) => {
        state.url = payload.url;
    },
    changeDiscordLoader: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ discordLoader: boolean }>
    ) => {
        state.discordLoader = payload.discordLoader;
    },
    changeWeb3ModalProvider: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ web3ModalProvider: any }>
    ) => {
        state.web3ModalProvider = payload.web3ModalProvider;
    },
    changeDaoId: (state: CommonSliceState, { payload }: PayloadAction<{ daoid: string }>) => {
        state.daoid = payload.daoid;
    },
    setMemberData: (
        state: CommonSliceState,
        {
            payload,
        }: PayloadAction<{
            member: any;
            connections: { total?: number; connections: any[] };
        }>
    ) => {
        const member = {
            data: payload.member,
            connections: payload.connections,
        };
        state.member = member;
    },
    setEventPopUp: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ eventPopUp: boolean }>
    ) => {
        state.eventPopUp = payload.eventPopUp;
    },
    createEventPopUp: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ createEvent: boolean }>
    ) => {
        state.createEvent = payload.createEvent;
    },
    changeReviewsData: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ reviewsData: WebNotification[] }>
    ) => {
        state.reviewsData = payload.reviewsData;
    },
    changePaymentsData: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ paymentsData: WebNotification[] }>
    ) => {
        state.paymentsData = payload.paymentsData;
    },
    changeTwitterData: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ twitterData: { connected: boolean; value: string } }>
    ) => {
        state.twitterdata = payload.twitterData;
    },
    addPinnedProject: (state: CommonSliceState, { payload }: PayloadAction<{ pinned: string }>) => {
        if (state.pinnedProjects.indexOf(payload.pinned) === -1) {
            state.pinnedProjects = [...state.pinnedProjects, payload.pinned];
        }
    },
    addPinnedProjectBulk: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ pinned: string[] }>
    ) => {
        state.pinnedProjects = payload.pinned;
    },
    removePinnedProject: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ pinned: string }>
    ) => {
        state.pinnedProjects = state.pinnedProjects.filter((id) => id !== payload.pinned);
    },
    changeAccessList: (
        state: CommonSliceState,
        {
            payload,
        }: PayloadAction<{
            accessList: {
                [key: string]: AccessEnums.AccessType[];
            };
        }>
    ) => {
        state.accessList = payload.accessList;
    },
    changeProjectDao: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ projectDao: string }>
    ) => {
        state.projectDao = payload.projectDao;
    },
    changeTokenCurrency: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ tokenCurrency: number }>
    ) => {
        state.tokenCurrency = payload.tokenCurrency;
    },
    changeDaoProgress: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ daoProgress: { [key in NewDAOItems]: boolean } }>
    ) => {
        state.daoProgress = payload.daoProgress;
    },
    changeContributorProgress: (
        state: CommonSliceState,
        {
            payload,
        }: PayloadAction<{ contributorProgress: { [key in NewContributorItems]: boolean } }>
    ) => {
        state.contributorProgress = payload.contributorProgress;
    },
    changeDaoSubdomainClaimed: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ daoSubdomainClaimed: boolean }>
    ) => {
        state.daoSubdomainClaimed = payload.daoSubdomainClaimed;
    },
    changeMemberSubdomainClaimed: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ memberSubdomainClaimed: boolean }>
    ) => {
        state.memberSubdomainClaimed = payload.memberSubdomainClaimed;
    },
    openLoginModal: (state: CommonSliceState, { payload }: PayloadAction<{ open: boolean }>) => {
        state.loginModal = payload.open;
    },
    changeTutorialStep: (state: CommonSliceState, { payload }: PayloadAction<{ step: number }>) => {
        state.tutorialStep = payload.step;
    },
    changeAddedDao: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ addedDao: boolean }>
    ) => {
        state.addedDao = payload.addedDao;
    },
    changeBillingTier: (state: CommonSliceState, { payload }: PayloadAction<{ tier: string }>) => {
        state.billingPriceTier = payload.tier;
    },
    changeBillingTerm: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ billing: string }>
    ) => {
        state.billingTerm = payload.billing;
    },
};

export default reducers;
