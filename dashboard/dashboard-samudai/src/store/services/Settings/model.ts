// import { IMember } from '../projects/model';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

export interface getRolesResponse {
    message: string;
    data: { roles: roles[] };
}

export interface roles {
    dao_id: string;
    role_id: string;
    name: string;
    discord_role_id: string;
    created_at: string;
    updated_at: string;
}

export interface createAccessRequest {
    access: {
        dao_id: string;
        access: AccessEnums.AccessType;
        members: string[];
        roles: string[];
    };
}

export interface createAccessRequestAll {
    accesses: {
        dao_id: string;
        access: AccessEnums.AccessType;
        members: string[];
        roles: string[];
    }[];
}

export interface getAccessResponse {
    message: string;
    data?: {
        id: string;
        dao_id: string;
        access: AccessEnums.AccessType;
        members: IMember[];
        roles: string[];
        created_at: string;
        updated_at: string;
    }[];
    error?: string;
}

export interface getConnectionResponse {
    message: string;
    data?: {
        pluginType: string;
        connected: boolean;
        value?: string;
    }[];
    error?: string;
}

export interface getTokenTesponse {
    message: string;
    error?: string;
    data?: {
        accessControlConditions: {
            returnValueTest: {
                comparator: string;
                value: string;
            };
            contractAddress: string;
            standardContractType: string;
            chain: string;
        }[];
    } | null;
}

export interface getDepartmentsRes {
    message: string;
    error: any;
    data: department[];
}

export interface department {
    department_id: string;
    dao_id: string;
    name: string;
    created_at: string;
}

export interface Telegram {
    generated_telegram_id: string;
    member_id: string;
    chat_id: string;
    username: string;
    first_name: string;
    last_name: string;
}

export interface getOtpResponse {
    message: string;
    error: any;
    data: {
        telegram_id: string;
        generatedOtp: string;
    };
}

export interface getTelegramExistResponse {
    message: string;
    error: any;
    data: {
        exist: boolean;
        username: string;
    };
}
