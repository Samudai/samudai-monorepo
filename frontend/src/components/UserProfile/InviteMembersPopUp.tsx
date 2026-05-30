import React, { useEffect, useState } from 'react';
import { selectActiveDao } from 'store/features/common/slice';
import { useCreateInviteMutation } from 'store/services/Dao/dao';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
}
const InviteMembersPopUp: React.FC<IProps> = ({ onClose }) => {
    const [link, setLink] = useState<string>('');
    const activeDAO = useTypedSelector(selectActiveDao);

    const [createInvite] = useCreateInviteMutation();

    useEffect(() => {
        createInvite({
            dao_id: activeDAO!,
            created_by: getMemberId(),
        })
            .unwrap()
            .then((res) => {
                setLink(window.location.origin + '/i/dm/' + res.data?.dao_invite);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [activeDAO]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(link);
        toast('Success', 2000, 'Invite Link Copied', '')();
        mixpanel.track('dao_invite', {
            member_id: getMemberId(),
            timestamp: new Date().toUTCString(),
            dao_id: activeDAO,
            invite_link: link,
        });
        onClose?.();
    };
    return (
        <>
            {
                <Popup
                    className="add-payments add-payments_complete"
                    dataParentId="invite_members_modal"
                >
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Invite Members to DAO'}
                    />
                    {!!link && (
                        <>
                            <div
                                style={{
                                    width: '98%',
                                    marginTop: '20px',
                                    background: '#1f2123',
                                    height: '60px',
                                    lineHeight: 2.4,
                                    borderRadius: '15px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <span style={{ color: '#52585e', padding: '15px' }}>{link}</span>
                            </div>
                            <div style={{ marginTop: '30px', minWidth: '30px' }}>
                                <Button
                                    color="green"
                                    style={{ width: '100px' }}
                                    onClick={handleCopyToClipboard}
                                    data-analytics-click="copy_button"
                                >
                                    <span>Copy</span>
                                </Button>
                            </div>
                        </>
                    )}
                </Popup>
            }
        </>
    );
};

export default InviteMembersPopUp;
