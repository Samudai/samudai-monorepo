import { IFeeds } from '@pushprotocol/restapi';
import { GroupChannel } from '@sendbird/chat/groupChannel';

export interface IFeedsNew extends IFeeds {
    name: string;
}

export enum Mode {
    EDIT = 'Edit',
    CREATE = 'Create',
}

export interface MessageSliceState {
    openMessagePopup: boolean;
    mode: Mode;
    reloadChats: boolean;
    activeChat?: IFeedsNew;
    activeChannel?: GroupChannel;
    sendbird?: any;
}

export const initialState: MessageSliceState = {
    openMessagePopup: false,
    mode: Mode.CREATE,
    reloadChats: false,
};
