import { useNavigate } from 'react-router-dom';
import { NfPerson } from '../elements/Components';
import { WebNotification } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { selectActiveDao } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import { NfCard } from '../elements';
import styles from '../styles/items/NfRequest.module.scss';

interface NfRequestProps {
    type: 'connection' | 'cooperation';
    data: WebNotification;
}

const NfRequest: React.FC<NfRequestProps> = ({ type, data }) => {
    const navigate = useNavigate();
    const activeDao = useTypedSelector(selectActiveDao);
    return (
        <NfCard component="ul" className={styles.root} style={{ justifyContent: 'space-between' }}>
            <li className={clsx(styles.col, styles.colPerson)}>
                <NfPerson
                    img={
                        data?.notificationContent?.metaData?.member?.profile_picture ||
                        '/img/icons/user-4.png'
                    }
                    name={data?.notificationContent.metaData?.member?.name || 'Unknown'}
                />
            </li>
            <li className={clsx(styles.col, styles.colPd, styles.colAction)}>
                <p className="nf-title">
                    {/* {type === 'connection' && 'Incoming Connection Request'}
          {type === 'cooperation' && 'Sent you a request for cooperationt'} */}
                    {data?.notificationContent?.notificationHeader}
                </p>
            </li>
            <li className={clsx(styles.col, styles.colPd, styles.coltime)}>
                <p className="nf-title">{dayjs(data?.timestamp).fromNow(true)} ago</p>
            </li>
            <li className={clsx(styles.col, styles.colControls)}>
                {/* <Button
          color="black"
          className={clsx(styles.controlBtn, styles.controlBtnCancel)}
        >
          <span>Cancel</span>
        </Button> */}
                <Button
                    color="green"
                    className={clsx(styles.controlBtn, styles.controlBtnAccept)}
                    onClick={() => {
                        if (data?.notificationContent?.metaData?.onView?.discussion_id) {
                            navigate(
                                `/${data?.notificationContent?.metaData?.onView?.dao_id}/forum/${data?.notificationContent?.metaData?.onView?.discussion_id}`
                            );
                        }
                        if (data?.notificationContent?.metaData?.onView?.project_id) {
                            navigate(
                                `/${data?.notificationContent?.metaData?.onView?.dao_id}/projects/${data?.notificationContent?.metaData?.onView?.project_id}/board`
                            );
                        } else if (data?.notificationContent?.metaData?.project?.project_id) {
                            navigate(
                                `/${data?.notificationContent?.metaData?.onView?.dao_id}/projects/${data?.notificationContent?.metaData?.project?.project_id}/board`
                            );
                        } else if (data?.notificationContent?.metaData?.response?.project_id) {
                            navigate(
                                `/${data?.notificationContent?.metaData?.onView?.dao_id}/projects/${data?.notificationContent?.metaData?.response?.project_id}/board`
                            );
                        }
                        return;
                    }}
                >
                    <span>View</span>
                </Button>
                {/* {type === 'connection' && (
          <Button
            color="green"
            className={clsx(styles.controlBtn, styles.controlBtnAccept)}
          >
            <span>Confirm</span>
          </Button>
        )}
        {type === 'cooperation' && (
          <Button
            color="green"
            className={clsx(styles.controlBtn, styles.controlBtnAccept)}
          >
            <span>To accept </span>
          </Button>
        )} */}
            </li>
        </NfCard>
    );
};

export default NfRequest;
