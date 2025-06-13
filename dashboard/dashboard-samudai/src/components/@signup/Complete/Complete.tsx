import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import MarkIcon from 'ui/SVG/MarkIcon';
import { getMemberId } from 'utils/utils';
import { ControlButton, ModalTitle } from '../elements';
import { CompleteProps } from '../types';
import './Complete.scss';

const Complete: React.FC<CompleteProps> = ({ state }) => {
    const navigate = useNavigate();

    const onClickControl = () => {
        if (localStorage.getItem('account_type') === 'admin') navigate('/dashboard/1');
        else navigate(`/${getMemberId()}/profile`);
    };

    return (
        <Modal className="modal-complete">
            <ModalTitle icon="/img/icons/complete.png" title="Complete" suptitle="Step 5/5" />
            <div className="modal-complete__slider">
                <span></span>
                <span className="--active"></span>
                <span></span>
            </div>
            <div className="modal-complete__content">
                <div className="modal-complete__mark">
                    <MarkIcon />
                </div>
                <div className="modal-complete__congratulations">Thank you, setup completed!</div>
            </div>
            <div className="modal-controls modal-complete__controls">
                <ControlButton
                    className="cmplbtn --green"
                    title="Complete"
                    onClick={onClickControl}
                />
            </div>
        </Modal>
    );
};

export default Complete;
