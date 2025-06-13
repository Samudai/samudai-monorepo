import { MemberResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import axios from 'axios';
import { Descendant, Node } from 'slate';
import store from 'store/store';

export const getMemberId = () => {
    const localData = localStorage.getItem('signUp');
    const localDataParse = JSON.parse(localData!);
    return localDataParse?.member_id || '';
};

export const getMemberfromAddress = async (walletAddress: string) => {
    const res = await axios.post(
        `${process.env.REACT_APP_GATEWAY}api/member/fetch`,
        {
            member: {
                type: 'wallet_address',
                value: walletAddress,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                daoid: store.getState().commonReducer.activeDao,
            },
        }
    );
    return res?.data?.data?.member as MemberResponse;
};

const responseCache: Record<string, MemberResponse> = {};

export const getMemberDataFromAddress = async (walletAddress: string) => {
    if (responseCache[walletAddress]) {
        return responseCache[walletAddress];
    }
    const member = await getMemberfromAddress(walletAddress);
    responseCache[walletAddress] = member;
    return member;
};

export const getMemberIdfromAddress = async (walletAddress: string) => {
    if (responseCache[walletAddress]) {
        return responseCache[walletAddress].member_id;
    }
    const member = await getMemberfromAddress(walletAddress);
    responseCache[walletAddress] = member;
    return member.member_id;
};

export const numFormatter = (num: number) => {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (num < 900) {
        return Math.round(num * 10) / 10; // if value < 1000, nothing to do
    }
};

export const walletFormatter = (address: number) => {
    return `${address}`.slice(0, 6) + '...' + `${address}`.slice(-4);
};

export const textLengthFormatter = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + ' ...' : text;
};

export const getInitial = (name: string) => {
    const output = name
        .split('.')
        .join(',')
        .split(' ')
        .join(',')
        .split('-')
        .join(',')
        .split('_')
        .join(',');

    const initials = output
        .split(',')
        .map((val) => val[0])
        .join('');
    return initials.slice(0, 2).toUpperCase();
};

export const getTime = (timestamp: number) => {
    const now = Date.now();
    const diff = (now - timestamp) / 60;
    if (diff < 60) {
        return `${diff} minutes ago`;
    }
    const time = new Date(timestamp);
    const mins = time.getMinutes();
    const hours = time.getHours();
    const am = hours > 12 ? 'PM' : 'AM';
    if (diff * 60 < 1000 * 24 * 60 * 60) return `${hours}:${mins} ${am}`;
    return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
};

export const getRawText = (data: Descendant[]) => {
    return data
        .map((item) => Node.string(item))
        .join(' ')
        .trim();
};

export const getQueryParam = (obj: Record<string, any>): string => {
    const queryParams: string[] = [];

    for (const key in obj) {
        if (key in obj) {
            const value = obj[key];

            if (Array.isArray(value) && value.length === 0) {
                continue; // Skip empty arrays
            }

            if (value === '' || value === null || value === undefined) {
                continue; // Skip empty strings and null/undefined values
            }

            if (Array.isArray(value)) {
                const encodedKey = encodeURIComponent(key);
                const encodedValue = value.map((item) => encodeURIComponent(item)).join(',');
                queryParams.push(`${encodedKey}=${encodedValue}`);
            } else {
                const encodedKey = encodeURIComponent(key);
                const encodedValue = encodeURIComponent(value);
                queryParams.push(`${encodedKey}=${encodedValue}`);
            }
        }
    }

    return queryParams.join('&');
};

export const getTrailDaoId = () => {
    if (process.env.REACT_APP_ENV === 'production') {
        return 'e27c7209-b5ba-4f5f-856f-dd2cb05453c0';
    } else if (process.env.REACT_APP_ENV === 'staging') {
        return '178534e4-ec05-4405-9791-7558555bb793';
    } else {
        return 'dd304ed6-f758-4dec-8413-3d972eb08a39';
    }
};

export const ensureHttpsProtocol = (link: string) => {
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return 'https://' + link;
    }
    return link;
};
