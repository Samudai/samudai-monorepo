import React, { useState } from 'react';
import { selectProvider, selectUserName } from 'store/features/common/slice';
import { useUpdateSubDomainMutation } from 'store/services/userProfile/userProfile';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
}
const DashboardAlert: React.FC<IProps> = ({ onClose }) => {
    const [load, setLoad] = useState<boolean>(false);
    const [confetti, setConfetti] = useState<boolean>(false);
    const [link, setLink, _, clearLink] = useInput('');
    const [sure, setSure] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(true);
    const [updateSubDomain] = useUpdateSubDomainMutation();
    const userName = useTypedSelector(selectUserName);
    const provider = useTypedSelector(selectProvider);

    return (
        <>
            {
                <Popup className="add-payments add-payments_complete">
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'No DAOs found for you'}
                    />
                    {/* <div className="add-payments__mark">
            <MarkIcon />
          </div> */}
                    <div style={{ display: 'flex' }}></div>

                    <span style={{ color: '#e3625a', marginTop: '20px', alignContent: 'center' }}>
                        Your DAO has not onboarded on Samudai, please ask your admin to complete
                        onboarding
                    </span>

                    <div style={{ marginTop: '50px', minWidth: '30px' }}>
                        <Button
                            // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                            color="orange"
                            style={{ width: '100px' }}
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <span>Okay</span>
                        </Button>
                    </div>
                </Popup>
            }
            {load && <Loader />}
        </>
    );
};

export default DashboardAlert;
