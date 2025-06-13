import dayjs from 'dayjs';
import usePopup from 'hooks/usePopup';
import Button from 'ui/@buttons/Button/Button';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import styles from './deal-pipeline-item.module.scss';
import UserIcon from 'ui/SVG/UserIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { EditIcon, TrashIcon, ShareIcon } from 'components/@pages/new-jobs/ui/icons';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { useTypedSelector } from 'hooks/useStore';
import { selectAccessList } from 'store/features/common/slice';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatMenuIcon } from 'components/@pages/forum/ui/icons/chat-menu-icon';
import { form } from 'store/services/Dashboard/model';
import { toast } from 'utils/toast';
import ShareFormModal from '../../popup/ShareFormModal';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';

interface DealPipelineItemProps {
    data: form;
    onEdit: () => void;
    onDelete: () => void;
}

export const DealPipelineItem: React.FC<DealPipelineItemProps> = ({ data, onEdit, onDelete }) => {
    const viewPopUp = usePopup();
    const sharePopup = usePopup();
    const { daoid } = useParams();
    const navigate = useNavigate();
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const memberData = data?.updated_by || data?.created_by;

    const applyFormClick = async () => {
        try {
            window.open(`${window.location.origin}/${data.form_id}/form`, '_blank');
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    return (
        <li className={styles.root}>
            <div className={styles.colName}>
                <p className={styles.name}>{data.name || ''}</p>
            </div>
            <div className={styles.colUser}>
                <div className={styles.row}>
                    <UserIcon className={styles.icon} />
                    <button
                        className={styles.userName}
                        onClick={() => navigate(`/${memberData?.member_id}/profile`)}
                    >
                        {memberData?.name || ''}
                    </button>
                </div>
            </div>
            <div className={styles.colDate}>
                <div className={styles.row}>
                    <CalendarIcon className={styles.icon} />
                    <p className={styles.text}>
                        {dayjs(data.updated_at || data.created_at).format('D MMM YYYY')}
                    </p>
                </div>
            </div>
            {/* <div className={styles.colTime}>
                <div className={styles.row}>
                    <ClockIcon className={styles.icon} />
                    <p className={styles.text}>{dayjs(date).format('hh:mm A')}</p>
                </div>
            </div> */}
            <div className={styles.colControls}>
                <Button color="green" className={styles.viewBtn} onClick={applyFormClick}>
                    {/* <div className={styles.markIcon}>
            <MarkIcon />
          </div> */}
                    <ArrowLeftIcon />
                    <span>Apply</span>
                </Button>
            </div>
            <SettingsDropdown button={<ChatMenuIcon />} className={styles.settings}>
                {access && (
                    <SettingsDropdown.Item className={styles.settings_option} onClick={onEdit}>
                        <EditIcon />
                        <span>Edit</span>
                    </SettingsDropdown.Item>
                )}
                {
                    <SettingsDropdown.Item
                        className={styles.settings_option}
                        onClick={sharePopup.open}
                    >
                        <ShareIcon />
                        <span>Share</span>
                    </SettingsDropdown.Item>
                }
                {access && (
                    <SettingsDropdown.Item className={styles.settings_option} onClick={onDelete}>
                        <TrashIcon />
                        <span>Delete</span>
                    </SettingsDropdown.Item>
                )}
            </SettingsDropdown>
            {/* <PopupBox active={viewPopUp.active} onClose={viewPopUp.close}>
                <ViewForm
                    onClose={viewPopUp.close}
                    retreivedData={data}
                    form_id={data.form_id}
                    response_id={response_id}
                />
            </PopupBox> */}
            <PopupBox active={sharePopup.active} onClose={sharePopup.close}>
                <ShareFormModal data={data} onClose={sharePopup.close} />
            </PopupBox>
        </li>
    );
};
