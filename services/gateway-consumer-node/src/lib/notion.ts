import axios from 'axios';
import { NotionDatabase } from '@samudai_xyz/gateway-consumer-types';
import { PageObjectResponse } from '../utils/notionApiEndpoint';
import { AuthResponse } from '../utils/types';

const serviceNotion = `${process.env.SERVICE_PLUGIN}/plugins/notion`;

export const auth = async (member_id: string, code: string, redirect_uri: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${serviceNotion}/auth`, {
            member_id,
            code,
            redirect_uri,
        });
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getAllDatabase = async (member_id: string): Promise<NotionDatabase[]> => {
    try {
        const response = await axios.post(`${serviceNotion}/getalldatabase`, {
            member_id,
        });
        return response.data.databases;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getDatabaseProperties = async (member_id: string, database_id: string) => {
    try {
        const response = await axios.post(`${serviceNotion}/getdatabaseproperties`, {
            member_id,
            database_id,
        });
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getDatabase = async (member_id: string, database_id: string) => {
    try {
        const response = await axios.post(`${serviceNotion}/getdatabase`, {
            member_id,
            database_id,
        });
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getPages = async (member_id: string, database_id: string) => {
    try {
        const response = await axios.post(`${serviceNotion}/getpages`, {
            member_id,
            database_id,
        });
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getMemberIDs = async (people: any) => {
    try {
        let user_ids: string[] = [];
        people.map((user: any) => {
            user_ids.push(user.id);
        });

        const response = await axios.post(`${serviceNotion}/getmemberids`, {
            user_ids,
        });
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getPageByID = async (pageId: string): Promise<PageObjectResponse> => {
    try {
        const response = await axios.get(`${serviceNotion}/page/${pageId}`);
        return response.data.page;
    } catch (err: any) {
        throw new Error(err);
    }
};
