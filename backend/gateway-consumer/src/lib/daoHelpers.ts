import axios from 'axios';
import { DAO, MemberDAOView } from '@samudai/gateway-consumer-types';

const daoService = process.env.SERVICE_DAO;

export const getDAOForMember = async (memberId: string): Promise<MemberDAOView[]> => {
    const response = await axios.get(`${daoService}/dao/bymemberid/${memberId}`);
    return response.data.dao;
};

export const getDAOInfo = async (daoId: string): Promise<DAO> => {
    const response = await axios.get(`${daoService}/dao/${daoId}`);
    return response.data.dao;
};
