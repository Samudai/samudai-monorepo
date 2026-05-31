import axios from 'axios';
import { randomBytes } from 'crypto';

export const generateSessionId = () => {
  return randomBytes(8).toString('hex');
};

export const getMemberInfo = async (memberId: string, jwt?: string) => {
  try {
    const memberData = await axios.post(
      `${process.env.GATEWAY_URL}/api/member/fetch`,
      {
        member: {
          type: 'member_id',
          value: memberId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return memberData.data.data.member;
  } catch (err: any) {
    if (err.response) {
      console.log(err.response.data);
      return null;
    } else {
      console.log(err);
      return null;
    }
  }
};

export const getMemberByWallet = async (wallet: string, jwt?: string) => {
  try {
    const memberData = await axios.post(
      `${process.env.GATEWAY_URL}/api/member/fetch`,
      {
        member: {
          type: 'wallet_address',
          value: wallet,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return memberData.data.data.member;
  } catch (err: any) {
    if (err.response) {
      console.log(err.response.data);
      return null;
    } else {
      console.log(err);
      return null;
    }
  }
};

export const getMembersByWallets = async (wallets: string[], jwt?: string): Promise<string[]> => {
  try {
    var members: string[] = await Promise.all(
      wallets.map(async (wallet) => {
        try {
          const memberData = await axios.post(
            `${process.env.GATEWAY_URL}/api/member/fetch`,
            {
              member: {
                type: 'wallet_address',
                value: wallet,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );

          console.log(memberData.data.data.member.member_id);

          return memberData.data.data.member.member_id;
        } catch (error) {
          console.error(`Error fetching member data for wallet ${wallet}:`);
          return null;
        }
      })
    );

    members = members.filter((member) => member !== null);

    return members;
  } catch (err: any) {
    return [];
  }
};

export const getTelegramChatIds = async (memberIds: string[], jwt?: string) => {
  try {
    const telegramData = await axios.post(
      `${process.env.GATEWAY_URL}/api/member/getbulktelegramchatids`,
      {
        memberIds: memberIds,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return telegramData.data?.data?.telegram;
  } catch (err: any) {
    if (err.response) {
      console.log(err.response.data);
      return null;
    } else {
      console.log(err);
      return null;
    }
  }
};
