import { AccessEnums, MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import { WebNotification } from '@samudai_xyz/gateway-consumer-types';
import {
    NewContributorItems,
    NewDAOItems,
} from '@samudai_xyz/gateway-consumer-types/dist/types/activity/enums';
import { ethers } from 'ethers';
import { DAOType } from 'root/mockup/daos';

export interface CommonSliceState {
    activeDao: string;
    projectDao: string;
    activeDaoName: string;
    daoList: DAOType[];
    provider: ethers.providers.Web3Provider | null;
    wallet: ethers.Wallet | null;
    socket: any | null;
    pushSDKSocket: any | null;
    account: string | null;
    jwt: string;
    roles: string[];
    profilePicture: string;
    gcal: boolean;
    notion: boolean;
    snapshot: boolean;
    gnosis: boolean;
    dropdown: any;
    notionProject: {
        department: string;
        name: string;
        database_id: string;
    };
    access: AccessEnums.AccessType[];
    projectid: string;
    taskid: string;
    token_gating: boolean;
    token_val: string;
    userName: string;
    member: {
        data: any | null;
        connections: {
            connections: MemberResponse[];
            total?: number;
        };
    } | null;
    showSettings: boolean;
    streamId: string | null;
    guildId: string | null;
    url: string | null;
    discordLoader: null | boolean;
    web3ModalProvider: any;
    daoid: string;
    eventPopUp: boolean;
    createEvent: boolean;
    reviewsData: WebNotification[];
    paymentsData: WebNotification[];
    twitterdata: {
        connected: boolean;
        value: string;
    };
    pinnedProjects: string[];
    accessList: {
        [key: string]: AccessEnums.AccessType[];
    };
    tokenCurrency: number | null;
    daoProgress: { [key in NewDAOItems]: boolean };
    contributorProgress: { [key in NewContributorItems]: boolean };
    daoSubdomainClaimed: boolean;
    memberSubdomainClaimed: boolean;
    loginModal: boolean;
    tutorialStep: number;
    addedDao: boolean;
    billingPriceTier?: string;
    billingTerm?: string;
}

export const initialState: CommonSliceState = {
    activeDao: '',
    activeDaoName: '',
    daoList: [],
    projectDao: '',
    provider: null,
    wallet: null,
    socket: null,
    pushSDKSocket: null,
    account: null,
    jwt: '',
    roles: [],
    profilePicture: '',
    gcal: false,
    notion: false,
    snapshot: false,
    gnosis: false,
    dropdown: [],
    notionProject: {
        department: '',
        name: '',
        database_id: '',
    },
    access: [],
    projectid: '',
    taskid: '',
    member: {
        data: null,
        connections: {
            connections: [],
            total: 0,
        },
    },
    token_gating: false,
    token_val: '',
    userName: '',
    showSettings: false,
    streamId: null,
    guildId: null,
    url: null,
    discordLoader: null,
    web3ModalProvider: null,
    daoid: '',
    eventPopUp: false,
    createEvent: false,
    reviewsData: [] as WebNotification[],
    paymentsData: [] as WebNotification[],
    twitterdata: {
        connected: false,
        value: '',
    },
    pinnedProjects: [],
    accessList: {},
    tokenCurrency: null,
    daoProgress: {
        setup_dao_profile: false,
        complete_integrations: false,
        create_a_project: false,
        claim_subdomain: false,
        connect_discord: false,
        connect_safe: false,
        connect_snapshot: false,
    },
    contributorProgress: {
        open_to_work: false,
        add_techstack: false,
        featured_projects: false,
        add_hourly_rate: false,
        accept_pending_requests: false,
        connect_telegram: false,
        claim_subdomain: false,
        claim_nft: false,
        connect_discord: false,
    },
    daoSubdomainClaimed: true,
    memberSubdomainClaimed: false,
    loginModal: false,
    tutorialStep: -1,
    addedDao: false,
};
