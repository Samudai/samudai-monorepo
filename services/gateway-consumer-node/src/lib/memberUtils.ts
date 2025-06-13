import axios from 'axios';
import { redis } from '../config/redisConfig';
import { IMember, MemberResponse, MembersEnums } from '@samudai_xyz/gateway-consumer-types';

export const mapMemberToUsername = async (memberId: string): Promise<MemberResponse | null> => {
    try {
        //Check if in members cache
        const memberData = await redis.get(`member${memberId}`);
        if (memberData) {
            const memberObj = JSON.parse(memberData);
            return memberObj;
        } else {
            const memberResponse = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                type: MembersEnums.FetchMemberType.MEMBER_ID,
                member_id: memberId,
            });

            //with expiry of 15mins
            await redis.setex(`member${memberId}`, 900, JSON.stringify(memberResponse.data.member));

            return memberResponse.data.member;
        }
        //If not in cache, fetch from db and add to cache
    } catch (err) {
        return null;
    }
};

export const bulkMemberMap = async (memberIds: string[]): Promise<IMember[]> => {
    try {
        const members: IMember[] = [];

        const newMemberIds = [...new Set(memberIds)];
        for (const memberId of newMemberIds) {
            const member = await mapMemberToUsername(memberId);
            if (member) {
                members.push({
                    member_id: member!.member_id,
                    username: member!.username,
                    profile_picture: member!.profile_picture,
                    name: member!.name,
                });
            }
        }
        return members;
    } catch (err: any) {
        return [];
    }
};

export const getMembersDefaultAddress = async (memberIds: string[]): Promise<string[]> => {
    try {
        const membersWallets: string[] = [];

        const newMemberIds = [...new Set(memberIds)];
        for (const memberId of newMemberIds) {
            const member = await mapMemberToUsername(memberId);
            if (member) {
                membersWallets.push(member.default_wallet_address);
            }
        }
        return membersWallets;
    } catch (err: any) {
        return [];
    }
};

export const getMemberByWallet = async (walletAddress: string): Promise<MemberResponse | undefined> => {
    try {
        const memberResponse = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
            type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
            wallet_address: walletAddress,
        });

        return memberResponse.data.member;

        //If not in cache, fetch from db and add to cache
    } catch (err) {
        return undefined;
    }
};

export const deleteMemberFromRedis = async (memberId: string) => {
    try {
        await redis.del(`member${memberId}`);
        return true;
    } catch (err) {
        return null;
    }
};
