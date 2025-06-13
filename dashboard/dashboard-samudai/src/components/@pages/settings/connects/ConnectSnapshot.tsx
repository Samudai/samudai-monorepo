import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
//import { Visibility } from '@samudai_xyz/gateway-consumer-types';
import { changeDaoProgress, selectActiveDao, selectDaoProgress } from 'store/features/common/slice';
import { useSnapshotAuthMutation } from 'store/services/Login/login';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { updateActivity } from 'utils/activity/updateActivity';
import { getMemberId } from 'utils/utils';
import styles from './styles/ConnectSnapshot.module.scss';
import { useUpdateDaoProgressMutation } from 'store/services/Dao/dao';

interface ConnectSnapshotProps {
    onCloseModal?: () => void;
    fetch1?: () => void;
    setConnected?: (state: boolean) => React.Dispatch<React.SetStateAction<boolean>>;
}

const ConnectSnapshot: React.FC<ConnectSnapshotProps> = ({
    onCloseModal,
    fetch1,
    setConnected,
}) => {
    const [snapshotAuth] = useSnapshotAuthMutation();
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const [spaceId, setSpaceId] = useInput('');
    const currDaoProgress = useTypedSelector(selectDaoProgress);
    const dispatch = useTypedDispatch();

    const [updateDaoProgress] = useUpdateDaoProgressMutation();

    const handleSubmit = () => {
        snapshotAuth({
            daoId: activeDao!,
            snapshot: spaceId,
        })
            .unwrap()
            .then(() => {
                setConnected?.(true);
                updateActivity({
                    dao_id: daoid!,
                    member_id: getMemberId(),
                    action_type: ActivityEnums.ActionType.SNAPSHOT_ADDED,
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
                if (!currDaoProgress.connect_snapshot) {
                    updateDaoProgress({
                        daoId: daoid!,
                        itemId: [ActivityEnums.NewDAOItems.CONNECT_SNAPSHOT],
                    }).then(() => {
                        dispatch(
                            changeDaoProgress({
                                daoProgress: {
                                    ...currDaoProgress,
                                    connect_snapshot: true,
                                },
                            })
                        );
                    });
                }
                toast('Success', 5000, 'Successfully connected Snapshot', '')();
                fetch1 && fetch1();
                onCloseModal && onCloseModal();
            })
            .catch((err: any) => {
                console.log('err:', err);
            });
    };
    return (
        <React.Fragment>
            <PopupTitle
                icon={require('components/@signup/icons/Snapshot.jpeg')}
                title="Connecting Snapshot"
            />
            <Input
                title="Snapshot Space ID"
                placeholder="gitcoindao.eth"
                value={spaceId}
                onChange={setSpaceId}
                className={styles.input}
                data-analytics-click="snapshot_id_input"
            />
            <Button
                color="green"
                className={styles.doneBtn}
                onClick={handleSubmit}
                data-analytics-click="done_button"
            >
                <span>Done</span>
            </Button>
        </React.Fragment>
    );
};

export default ConnectSnapshot;
