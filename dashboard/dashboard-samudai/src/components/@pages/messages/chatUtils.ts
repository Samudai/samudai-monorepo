import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { changeChatKey, changeChatUser, setChats } from 'store/features/chats/slice';
import store from 'store/store';
import { ChatCreateGroupType } from '@pushprotocol/restapi/src/lib/chat';
import { DiscussionEnums, MessageResponse } from '@samudai_xyz/gateway-consumer-types';

export const sendMessage = async (content: string, activeChat: PushAPI.IFeeds, chatKey: string) => {
    const provider = store.getState().commonReducer.provider;
    const _signer = provider?.getSigner();
    const response = await PushAPI.chat.send({
        messageContent: content,
        messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
        receiverAddress: `${activeChat?.wallets}`,
        signer: _signer,
        pgpPrivateKey: chatKey,
    });

    return response;
};

export const decryptKey = async (user: PushAPI.IUser, dispatch: any): Promise<string> => {
    const provider = store.getState().commonReducer.provider;
    const _signer = provider?.getSigner();
    const decryptedPvtKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        signer: _signer,
    });
    // console.log(decryptedPvtKey);
    dispatch(changeChatKey({ chatKey: decryptedPvtKey }));
    return decryptedPvtKey;
};

export const fetchChats = async (
    account: string,
    chatEnv: ENV,
    dispatch: any,
    chatKey?: string
) => {
    const chats = await PushAPI.chat.chats({
        account: `eip155:${account}`,
        toDecrypt: true,
        pgpPrivateKey: chatKey,
        env: chatEnv,
    });

    const chatRequests = await PushAPI.chat.requests({
        account: `eip155:${account}`,
        toDecrypt: true,
        pgpPrivateKey: chatKey,
        env: chatEnv,
    });

    console.log('chatRequests', chatRequests);

    dispatch(setChats({ chats: [...chats] }));

    return { chats, chatRequests };
};

export const fetchHistory = async (threadHash: string, account: string, chatKey: string) => {
    const chatHistory = await PushAPI.chat.history({
        threadhash: threadHash,
        account: `eip155:${account}`,
        toDecrypt: true,
        limit: 30,
        pgpPrivateKey: chatKey,
    });

    return chatHistory;
};

export const initializePush = async (
    account: string,
    chatEnv: ENV,
    chatKey: string | undefined,
    dispatch: any
) => {
    const user = await PushAPI.user.get({
        account: `eip155:${account}`,
        env: chatEnv,
    });

    // For creating a new user if unable to fetch user from SDK
    if (!user) {
        await PushAPI.user.create({
            account,
            env: chatEnv,
        });
        console.log('push init');
    }
    console.log('push user', user);
    dispatch(changeChatUser({ chatUser: user }));

    let decryptedPvtKey = chatKey || '';
    if (!chatKey) {
        decryptedPvtKey = await decryptKey(user, dispatch);
        // console.log('key', decryptedPvtKey);
    }

    if (decryptedPvtKey) {
        return fetchChats(account, chatEnv, dispatch, decryptedPvtKey);
    }
};

export const createGroup = async (data: ChatCreateGroupType) => {
    const response = await PushAPI.chat.createGroup(data);
    return response;
};

interface ApproveRequest {
    senderAddress: string;
    pgpPrivateKey?: string;
    status?: 'Approved';
    account?: string;
    signer?: PushAPI.SignerType;
    env?: ENV;
}

export const approveRequest = async (data: ApproveRequest) => {
    const response = await PushAPI.chat.approve(data);
    return response;
};

export const convertMessageToType = (chatHistory: PushAPI.IMessageIPFS[]) => {
    const messageArr: MessageResponse[] = [];
    chatHistory.reverse();
    chatHistory.forEach((message) => {
        const messageObj: any = {
            message_id: message.signature,
            discussion_id: '',
            type:
                message.messageType === 'Text'
                    ? DiscussionEnums.MessageType.TEXT
                    : message.messageType === 'Image'
                    ? DiscussionEnums.MessageType.FILE
                    : message.messageType === 'GIF'
                    ? 'gif'
                    : DiscussionEnums.MessageType.TEXT,
            sender_id: message.fromCAIP10,
            content: message.messageContent,
            created_at: message.timestamp
                ? new Date(message.timestamp!).toUTCString()
                : new Date().toUTCString(),
        };
        messageArr.push(messageObj);
    });
    return messageArr;
};
