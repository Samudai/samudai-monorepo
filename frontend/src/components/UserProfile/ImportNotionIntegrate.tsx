import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import { getMemberId } from 'utils/utils';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
}
const NotionIntegrate: React.FC<IProps> = ({ onClose }) => {
    const [load, setLoad] = useState<boolean>(false);
    const navigate = useNavigate();
    const { daoid } = useParams();

    return (
        <>
            {
                <Popup className="add-payments add-payments_complete">
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Notion not Connected'}
                    />
                    {/* <div className="add-payments__mark">
            <MarkIcon />
          </div> */}
                    <div style={{ display: 'flex' }}></div>

                    <span style={{ color: 'white', marginTop: '20px', textAlign: 'center' }}>
                        Notion is not Connected. Please go to connected apps in contributor settings
                        to connect.
                    </span>

                    <div style={{ marginTop: '50px', minWidth: '30px' }}>
                        <Button
                            // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                            color="orange"
                            style={{ width: '120px' }}
                            onClick={() => {
                                navigate(`/${getMemberId()}/settings/contributor/apps`);
                            }}
                            disabled={load}
                        >
                            <span>Go to Settings</span>
                        </Button>
                    </div>
                </Popup>
            }
            {load && <Loader />}
        </>
    );
};

export default NotionIntegrate;
