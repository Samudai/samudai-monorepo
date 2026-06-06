import axios from 'axios';
import { DAO, MemberDAOView } from '@samudai_xyz/gateway-consumer-types';

const daoService = process.env.SERVICE_DAO;

export const getDAOForMember = async (memberId: string): Promise<MemberDAOView[]> => {
    try {
        const response = await axios.get(`${daoService}/dao/bymemberid/${memberId}`);
        return response.data.dao;
    } catch (err: any) {
        throw err;
    }
};

export const getDAOInfo = async (daoId: string): Promise<DAO> => {
    try {
        const response = await axios.get(`${daoService}/dao/${daoId}`);
        return response.data.dao;
    } catch (err: any) {
        throw err;
    }
};
