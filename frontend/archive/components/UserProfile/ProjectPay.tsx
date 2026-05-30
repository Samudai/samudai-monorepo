import React, { useState } from 'react';
import Confetti from 'react-confetti';
import { Payout, TaskResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import { Subdomain } from '@samudai_xyz/web3-sdk';
import clsx from 'clsx';
import { selectProvider, selectUserName } from 'store/features/common/slice';
import { useUpdateSubDomainMutation } from 'store/services/userProfile/userProfile';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import MarkIcon from 'ui/SVG/MarkIcon';
import { cutText } from 'utils/format';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import PaySmallComponent from './PaySmallComponent';
import './styles/ClaimSubdomain.scss';

interface IProps {
  onClose: () => void;
  task: TaskResponse | undefined;
}
const ProjectPay: React.FC<IProps> = ({ onClose, task }) => {
  const [load, setLoad] = useState<boolean>(false);
  const [payout, setPayout] = useState<Payout[]>(task?.payout || ([] as Payout[]));

  return (
    <>
      {
        <Popup className="add-payments add-payments_complete">
          <PopupTitle
            className="add-payments__title"
            icon="/img/icons/complete.png"
            title={'Bounties payment'}
          />
          {/* <div className="add-payments__mark">
            <MarkIcon />
          </div> */}
          <div style={{ display: 'flex' }}></div>

          {/* <span style={{ color: '#e3625a', marginTop: '20px' }}>
            Your DAO has not onboardedon Samudai, ask them to anboard touse dahsboard.
          </span> */}
          {payout?.map((val) => {
            return (
              <PaySmallComponent
                key={val.id}
                payout={val}
                setState={setPayout}
                state={payout}
                taskId={task?.task_id!}
              />
            );
          })}
          {/* <div
            style={{
              marginTop: '50px',
              minWidth: '30px',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <div style={{ marginTop: '7px', marginRight: '20px', color: 'white' }}>
              {cutText(task?.payout[0]?.receiver_address || '', 20)}
            </div>
            <Button
              // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
              color="orange"
              style={{ width: '70px' }}
              onClick={() => {
                onClose();
              }}
            >
              <span>Okay</span>
            </Button>
          </div> */}
        </Popup>
      }
      {load && <Loader />}
    </>
  );
};

export default ProjectPay;
