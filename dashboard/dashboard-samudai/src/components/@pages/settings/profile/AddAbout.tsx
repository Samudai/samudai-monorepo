import React from 'react';
import { useParams } from 'react-router-dom';
import { ActivityEnums, DAO } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import { useUpdateDaoMutation } from 'store/services/Dao/dao';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './styles/AddAbout.module.scss';

interface AddAboutProps {
    onCloseModal?: () => void;
    daoData: DAO;
    value: string;
    setValue: (value: string) => void;
    setConnected?: (state: boolean) => React.Dispatch<React.SetStateAction<boolean>>;
}

const AddAbout: React.FC<AddAboutProps> = ({ onCloseModal, daoData, setValue, value }) => {
    const [updateDao] = useUpdateDaoMutation();
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const [text, setText, _, clearText] = useInput<HTMLTextAreaElement>(value ? value : '');

    const handleSubmit = () => {
        if (!text) {
            toast('Failure', 5000, 'Input Field cannot be empty', '')();
            return;
        }
        if (text.length > 1500)
            return toast('Failure', 5000, 'Input Field cannot be more than 1500 characters', '')();
        const dao = daoData;
        dao.about = text;
        updateDao({
            daoProfile: dao,
        })
            .unwrap()
            .then(() => {
                setValue(text);
                toast('Success', 5000, 'About DAO Updated', 'Successfully updated About DAO.')();
                updateActivity({
                    dao_id: daoid!,
                    member_id: getMemberId(),
                    action_type: ActivityEnums.ActionType.ABOUT_ADDED,
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
                onCloseModal && onCloseModal();
            })
            .catch((err) => {
                toast('Failure', 5000, 'Error', 'Error while updating About DAO')();
                console.log('err:', err);
            });
    };
    return (
        <React.Fragment>
            <PopupTitle icon={'/img/icons/about.png'} title="Add About DAO" />
            <div>
                <TextArea
                    placeholder="Add your About DAO here"
                    title="Add your about DAO here..."
                    value={text}
                    onChange={setText}
                    className={clsx(styles.textArea, 'orange-scrollbar')}
                    style={{ minHeight: '300px', overflowY: 'scroll' }}
                    data-analytics-click="add_about_dao_input"
                />
            </div>
            <Button
                color="green"
                className={styles.doneBtn}
                onClick={handleSubmit}
                data-analytics-click="add_about_dao_submit"
            >
                <span>Done</span>
            </Button>
        </React.Fragment>
    );
};

export default AddAbout;
