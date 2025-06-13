import Popup from '../components/Popup/Popup';
import PopupBox from '../components/PopupBox/PopupBox';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types/';
import { selectActiveDao } from 'store/features/common/slice';
import { removeView } from 'store/features/dao/slice';
import { useDeleteDashboardMutation } from 'store/services/Dashboard/dashboard';
import store from 'store/store';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { IView } from 'utils/types/DAO';
import { getMemberId } from 'utils/utils';
import { PopupShowProps } from '../types';
import './DeleteView.scss';

interface DeleteViewProps extends PopupShowProps {
    view: IView | null;
}

const DeleteView: React.FC<DeleteViewProps> = ({ active, onClose, view }) => {
    const dispatch = useTypedDispatch();
    const [deleteView] = useDeleteDashboardMutation();
    const activeDao = useTypedSelector(selectActiveDao);
    const onConfirm = async () => {
        if (view) {
            try {
                toast('Attention', 5000, 'Please wait', 'Deleting the View')();
                const res = await deleteView(view.id).unwrap();
                if (res) {
                    dispatch(removeView(view.id));
                    updateActivity({
                        dao_id: activeDao!,
                        member_id: getMemberId(),
                        action_type: ActivityEnums.ActionType.VIEW_DELETED,
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
                        metadata: {
                            view_name: view.name,
                        },
                    });
                }
                toast('Success', 5000, 'View Deleted', 'The View has been deleted')();
                onClose(); // To close popup
            } catch (err) {
                console.log(err);
                toast('Failure', 5000, 'Error Deleting View', 'Failed to delete the View')();
            }
        }
    };

    return (
        <PopupBox className="delete-view__popup" active={active}>
            <Popup className="delete-view">
                <PopupTitle
                    icon="/img/icons/delete.png"
                    title={
                        <>
                            Delete <strong>{view && view.name}</strong>?
                        </>
                    }
                />
                <div className="delete-view__nav">
                    <Button className="delete-view__btn delete-view__btn_cancel" onClick={onClose}>
                        <span>Cancel</span>
                    </Button>
                    <Button
                        className="delete-view__btn delete-view__btn_delete"
                        onClick={onConfirm}
                    >
                        <span>Delete</span>
                    </Button>
                </div>
            </Popup>
        </PopupBox>
    );
};

export default DeleteView;
