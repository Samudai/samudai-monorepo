import React, { useMemo } from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
    code: string | null;
    count: number;
}
const Invite: React.FC<IProps> = ({ onClose, code, count }) => {
    const url = useMemo(() => {
        return `${window.location.origin}/invite/member/${code}`;
    }, [code]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast('Success', 5000, 'Copied to clipboard', '')();
        mixpanel.track('member_invite', {
            member_id: getMemberId(),
            timestamp: new Date().toUTCString(),
            invite_link: url,
        });
    };

    return (
        <>
            {
                <Popup className="add-payments add-payments_complete">
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Invite'}
                    />
                    {/* <div className="add-payments__mark">
            <MarkIcon />
          </div> */}
                    <div style={{ display: 'flex' }}></div>

                    <span style={{ color: 'white', marginTop: '40px' }}>
                        You have invited {count} members to join your Samudai.
                    </span>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            margin: '40px',
                            gap: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ width: '400px' }}>
                            <Input
                                value={url}
                                // className={styles.inputTitle}
                                placeholder="Invite Code..."
                                onChange={() => {}}
                                disabled
                            />
                        </div>
                        {/* <div>
              <Button
                // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                color="orange"
                style={{ width: '100px' }}
                onClick={() => {}}
              >
                <span>Copy</span>
              </Button>
            </div> */}
                    </div>

                    <div style={{ minWidth: '30px' }}>
                        <Button
                            // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                            color="green"
                            style={{ width: '100px' }}
                            onClick={() => {
                                handleCopyToClipboard();
                            }}
                        >
                            <span>Copy</span>
                        </Button>
                    </div>
                </Popup>
            }
        </>
    );
};

export default Invite;
