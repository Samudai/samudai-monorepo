import React, { useState } from 'react';
import Confetti from 'react-confetti';
import { Subdomain } from '@samudai_xyz/web3-sdk';
import { selectProvider } from 'store/features/common/slice';
import { useUpdateSubDomainMutation } from 'store/services/userProfile/userProfile';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
    setNewDomain: React.Dispatch<React.SetStateAction<string>>;
    count: number;
}
const ClaimSubdomain: React.FC<IProps> = ({ onClose, setNewDomain, count }) => {
    const [load, setLoad] = useState<boolean>(false);
    const [confetti, setConfetti] = useState<boolean>(false);
    const [link, setLink, _, clearLink] = useInput('');
    const [sure, setSure] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(true);
    const [updateSubDomain] = useUpdateSubDomainMutation();
    const provider = useTypedSelector(selectProvider);
    require('dotenv').config();
    const handleClaim = async () => {
        try {
            setLoad(true);
            const sdk = new Subdomain(process.env.REACT_APP_ENV!);
            const res = await sdk.claimSubdomain(link, provider!);
            if (res === true) {
                // const update = await updateSubDomain({
                //   memberId: getMemberId(),
                //   subdomain: `${link}.samudai.eth`,
                // }).unwrap();
                setLoad(false);
                mixpanel.track('subdomain_claimed', {
                    member_id: getMemberId(),
                    timestamp: new Date().toUTCString(),
                    subdomain: `${link}.samudai.eth`,
                });
                toast('Success', 50000, 'Successfully Claimed', '')();
                setNewDomain(`${link}.samudai.eth`);
                setShow(false);
                setConfetti(true);
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                toast('Failure', 5000, 'Something went wrong', '')();
            }
        } catch (err: any) {
            setLoad(false);
            console.log(err);
            toast('Failure', 5000, 'Something went wrong', err?.message)();
        }
    };
    return (
        <>
            {!load && (
                <Popup className="add-payments add-payments_complete">
                    <Confetti
                        gravity={0.4}
                        run={confetti}
                        numberOfPieces={4000}
                        {...{
                            width: 10000,
                            height: 10000,
                        }}
                    />
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Claim a Samudai Subdomain'}
                    />
                    <span
                        style={{
                            color: 'white',
                            marginTop: '40px',
                            textAlign: 'center',
                            lineHeight: '2rem',
                        }}
                    >
                        You have invited {count} members to join Samudai <br />
                        {count < 5 && (
                            <span>Invite {5 - count} more members to claim your subdomain</span>
                        )}
                    </span>
                    {/* <div className="add-payments__mark">
            <MarkIcon />
          </div> */}
                    <div style={{ display: 'flex' }}>
                        {!sure && show && (
                            <Input
                                className="subdomain_input"
                                inputHeight="37px"
                                placeholder="Enter a name"
                                value={link}
                                onChange={setLink}
                                disabled={count < 5}
                            ></Input>
                        )}
                        <p
                            className="add-payments__thx"
                            style={{
                                marginTop: '60px',
                                marginLeft: '10px',
                                marginBottom: !show ? '30px' : '',
                                color: '#b2ffc3',
                                font: '600 18px/1.43 "Lato", sans-serif',
                            }}
                        >
                            {sure && link}.samudai.eth
                        </p>
                    </div>
                    {sure && show && (
                        <span style={{ color: '#fdc087', marginTop: '20px' }}>
                            You can only claim this ONCE. Do you want to continue?
                        </span>
                    )}
                    {!sure && (
                        <div style={{ marginTop: '50px', minWidth: '30px' }}>
                            <Button
                                // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                                color={count < 5 ? 'gray' : 'orange'}
                                style={{
                                    width: '100px',
                                    cursor: count > 4 ? 'pointer' : 'not-allowed',
                                }}
                                onClick={() => {
                                    !!link && setSure(true);
                                }}
                                disabled={count < 5}
                            >
                                <span>Claim</span>
                            </Button>
                        </div>
                    )}
                    {sure && show && (
                        <div
                            style={{
                                marginTop: '50px',
                                minWidth: '30px',
                                display: 'flex',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Button
                                // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                                color="orange"
                                style={{ width: '100px', marginRight: '70px' }}
                                onClick={() => onClose()}
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button
                                // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                                color="green"
                                style={{ width: '100px' }}
                                onClick={handleClaim}
                            >
                                <span>Yes</span>
                            </Button>
                        </div>
                    )}
                </Popup>
            )}
            {load && <Loader />}
        </>
    );
};

export default ClaimSubdomain;
