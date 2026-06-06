import React from 'react';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import Popup from 'components/@popups/components/Popup/Popup';
import CloseButton from 'ui/@buttons/Close/Close';
import css from './jobs-chat.module.scss';
import { SendBirdChat } from 'components/tasks-board/ui/sendbird-chat';

interface JobsChatProps {
    member: IMember;
    onClose?: () => void;
}

export const JobsChat: React.FC<JobsChatProps> = ({ member, onClose }) => {
    return (
        <Popup className={css.assignees} dataParentId="chat_modal">
            <div className={css.assignees_head}>
                <h2 className={css.assignees_title}>Chats</h2>
                <CloseButton className={css.assignees_closeBtn} onClick={() => onClose?.()} />
            </div>
            <SendBirdChat data={member} />
        </Popup>
    );
};
