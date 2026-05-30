import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMemberId } from '../../../../utils/utils';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types/';
import {
    changeTwitterData,
    selectActiveDao,
    selectActiveDaoName,
    selectProvider,
} from 'store/features/common/slice';
import { useVerifyTwitterMutation } from 'store/services/Settings/settings';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import CopyIcon from 'ui/SVG/CopyIcon';
import { Twitter } from 'ui/SVG/socials';
import { generateTweetSignature } from 'utils/Twittter/verify';
import { updateActivity } from 'utils/activity/updateActivity';
import styles from './styles/ConnectTwitter.module.scss';

interface ConnectTwitterProps {
    onCloseModal?: () => void;
    handleConnect?: () => void;
}

const ConnectTwitter: React.FC<ConnectTwitterProps> = ({
    onCloseModal,
    handleConnect: changeConnected,
}) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const providerEth = useTypedSelector(selectProvider);
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const activeDaoName = useTypedSelector(selectActiveDaoName);
    const [value, setValue] = useState<string>('');
    const [verifyTwitter] = useVerifyTwitterMutation();
    const dispatch = useTypedDispatch();
    const [userName, setUserName] = useInput('');

    const handleCopyToClipboard = () => {
        const input = inputRef.current;
        if (input) {
            input.select();
            input.setSelectionRange(0, value.length);
            navigator.clipboard.writeText(input.value);
        }
    };

    const handleConnect = async () => {
        const value = userName[0] !== '@' ? userName : userName.slice(1);
        try {
            const res = await generateTweetSignature(value, providerEth!, activeDaoName);
            setValue(res!);
            console.log('twitter', res);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerify = async () => {
        const signer = providerEth?.getSigner();
        const address = await signer?.getAddress();
        const payload = {
            address: address!,
            linkId: activeDAO,
            username: userName[0] !== '@' ? userName : userName.slice(1),
        };
        await verifyTwitter(payload)
            .then((res) => {
                dispatch(
                    changeTwitterData({
                        twitterData: {
                            connected: true,
                            value: userName[0] !== '@' ? userName : userName.slice(1),
                        },
                    })
                );
                updateActivity({
                    dao_id: daoid!,
                    member_id: getMemberId(),
                    action_type: ActivityEnums.ActionType.TWITTER_ADDED,
                    visibility: ActivityEnums.Visibility.PUBLIC,
                    member: {
                        username: store.getState().commonReducer?.member?.data.username || '',
                        profile_picture:
                            store.getState().commonReducer?.member?.data.profile_picture || '',
                    },
                    dao: {
                        dao_name: store.getState().commonReducer?.activeDaoName || '',
                        profile_picture: store.getState().commonReducer?.profilePicture || '',
                    },
                    project: {
                        project_name: '',
                    },
                    task: {
                        task_name: '',
                    },
                    action: {
                        message: '',
                    },
                    metadata: {},
                });
                onCloseModal?.();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <React.Fragment>
            <PopupTitle
                icon={
                    <div className={styles.icon}>
                        <Twitter />
                    </div>
                }
                title="Connecting Twitter"
            />
            <p className={styles.subtitle}>Enter Twitter Username</p>
            <div
                style={{
                    display: 'flex',
                    margin: '20px 0',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{ maxWidth: '40%', marginRight: '20px' }}>
                    <Input
                        placeholder="username"
                        title=""
                        className={styles.input}
                        value={userName}
                        onChange={setUserName}
                    />
                </div>
                <Button color="green" onClick={handleConnect}>
                    <span>Connect</span>
                </Button>
            </div>
            {!!value && (
                <>
                    <p className={styles.subtitle}>
                        Copy and Post this message on Twitter for verification
                    </p>
                    <TextArea
                        className={styles.textarea}
                        ref={inputRef}
                        value={value}
                        onChange={() => null}
                    />
                    <button className={styles.copyBtn} onClick={handleCopyToClipboard}>
                        <CopyIcon />
                        <span>Copy Text</span>
                    </button>
                    <button className={styles.copyBtn} style={{ cursor: 'default' }}>
                        <span>Please wait atleast 5 seconds after sending the tweet.</span>
                    </button>
                    <Button className={styles.connectBtn} color="green" onClick={handleVerify}>
                        <span>Verify</span>
                    </Button>
                </>
            )}
        </React.Fragment>
    );
};

export default ConnectTwitter;
