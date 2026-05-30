import { ProposalsItem } from '../proposals-item';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { PopupShowProps } from 'components/@popups/types';
import Block from 'components/Block/Block';
import './proposals-popup.scss';

interface ProposalsPopupProps extends PopupShowProps {
    data: any[];
}

export const ProposalsPopup: React.FC<ProposalsPopupProps> = ({ data, active, onClose }) => {
    return (
        <PopupBox active={active} onClose={onClose} className="proposals-popup__popup">
            <Popup className="proposals-popup">
                <Block className="proposals-popup__block">
                    <Block.Header className="proposals-popup__header">
                        <Block.Title>Recent Proposals</Block.Title>
                    </Block.Header>
                    <Block.Scrollable className="proposals-popup__content" component="ul">
                        <li className="proposals-item proposals-item_title">
                            <div className="proposals-item__col proposals-item__col-info">
                                <strong>Proposals</strong>
                            </div>
                            {/* <div className="proposals-item__col proposals-item__col-progress">
                <div className="proposals-item__progress proposals-item__progress_for">
                  <strong>Votes for</strong>
                </div>
                <div className="proposals-item__progress proposals-item__progress_against">
                  <strong>Votes against</strong>
                </div>
              </div> */}
                            <div className="proposals-item__col proposals-item__col-status">
                                <strong>Status</strong>
                            </div>
                            <div className="proposals-item__col proposals-item__col-controls">
                                <strong></strong>
                            </div>
                        </li>
                        {data?.map((item, id) => <ProposalsItem key={id} {...item} />)}
                    </Block.Scrollable>
                </Block>
            </Popup>
        </PopupBox>
    );
};
