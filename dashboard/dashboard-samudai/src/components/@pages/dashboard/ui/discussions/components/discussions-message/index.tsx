import { getTime } from 'utils/utils';
import { MessageResponse, IMember } from '@samudai_xyz/gateway-consumer-types';

interface DiscussionsMessageProps extends MessageResponse {
    participants: IMember[];
}

export const DiscussionsMessage: React.FC<DiscussionsMessageProps> = ({
    message_id,
    sender_id,
    content,
    created_at,
    participants,
}) => {
    const replaceMentionsId = (text: string) => {
        let modifiedText = text;

        [...participants, { name: 'all', member_id: 'all' }].forEach((member) => {
            const mentionRegex = new RegExp(`<@${member.member_id}>`, 'g');
            modifiedText = modifiedText.replace(mentionRegex, (match, id) => {
                if (member.member_id === 'all') {
                    return `<span>@${member.name}</span>`;
                } else {
                    return `
                            <a href="/${member.member_id}/profile" target="blank" style="display: unset">
                                <span>@${member.name}</span>
                            </a>
                        `;
                }
            });
        });

        return modifiedText;
    };

    return (
        <li className="dao-discussions-message" key={message_id}>
            <div
                className="dao-discussions-message__user-name"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
            >
                <div>{participants.find((item) => item.member_id === sender_id)?.name || ''}</div>
                <div
                    className="dao-discussions-message__user-name-time"
                    style={{ color: '#52585e', font: '400 14px/1.25 "Lato", sans-serif' }}
                >
                    {created_at && getTime(created_at as any)}
                </div>
            </div>
            <div
                className="dao-discussions-message__text"
                dangerouslySetInnerHTML={{
                    __html: replaceMentionsId(content || ''),
                }}
            />
            {/* <p className="dao-discussions-message__timestamp">{getTime(created_at)}</p> */}
        </li>
    );
};
