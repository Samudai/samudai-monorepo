import { AccessEnums, MemberResponse } from '@samudai/gateway-consumer-types';
import { WebNotification } from '@samudai/gateway-consumer-types';
import {
    NewContributorItems,
    NewDAOItems,
} from '@samudai/gateway-consumer-types/dist/types/activity/enums';
import { DAOType } from 'root/mockup/daos';
import type { Provider, Signer } from 'ethers';

// Minimal surface used from the @pushprotocol/socket connection (a socket.io
// `Socket`). Typed structurally so it's satisfied regardless of which socket.io
// copy produced it (sidesteps the CJS/ESM dual-package nominal mismatch) and is
// immer-`Draft`-safe (interface, no `#private` fields).
export interface PushSDKSocket {
    on(event: string, listener: (...args: any[]) => void): void;
}

export interface CommonSliceState {
    activeDao: string;
    projectDao: string;
    activeDaoName: string;
    daoList: DAOType[];
    // Typed as the ethers `Provider`/`Signer` *interfaces* rather than the concrete
    // `BrowserProvider`/`Wallet` classes: those classes carry ECMAScript `#private`
    // fields, which immer's `WritableDraft<>` (RTK Toolkit 2) can't reproduce, so the
    // concrete classes break `createSlice`'s `Draft<State>` reducer typing. A
    // `BrowserProvider`/`Wallet` is assignable to `Provider`/`Signer`; selectors and
    // readers down-cast to `BrowserProvider` where the concrete API is needed.
    provider: Provider | null;
    wallet: Signer | null;
    socket: any | null;
    pushSDKSocket: PushSDKSocket | null;
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
