import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao } from 'store/features/common/slice';
import { useAddBlogMutation } from 'store/services/Dashboard/dashboard';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './BlogsAdd.module.scss';

interface BlogsAddProps {
    onClose: () => void;
    fetchData: () => void;
    onClose1: () => void;
}

const BlogsAdd: React.FC<BlogsAddProps> = ({ onClose, onClose1, fetchData }) => {
    const [addBlog] = useAddBlogMutation();
    const [link, setLink, _, clearlink] = useInput('');
    const { daoid } = useParams();
    const [loading, setLoading] = useState(false);
    const activeDAO = useTypedSelector(selectActiveDao);
    const addBlogHandler = () => {
        //form validation
        if (link.length === 0) {
            toast('Failure', 5000, 'Input Field cannot be empty', '')();
            return;
        }
        setLoading(true);
        addBlog({
            blog: {
                dao_id: daoid!,
                link: link,
            },
        })
            .unwrap()
            .then((res) => {
                console.log(res);
                updateActivity({
                    dao_id: daoid!,
                    member_id: getMemberId(),
                    action_type: ActivityEnums.ActionType.BLOG_ADDED,
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
                clearlink();
                onClose1();
                onClose();
                toast('Success', 5000, 'Blog Added', '')();
                setTimeout(() => {
                    setLoading(false);
                    fetchData();
                }, 3000);
            })
            .catch((err) => {
                setLoading(false);
                toast('Failure', 5000, 'Unable to add blog', 'Please check the link')();
                console.error(err);
            });
    };

    return (
        <Popup className={styles.root} onClose={onClose1} dataParentId="add_blog_modal">
            <PopupTitle icon="/img/icons/file.png" title="Add Post" />
            <Input
                placeholder="Post link"
                title="Link"
                className={styles.input}
                value={link}
                onChange={setLink}
                data-analytics-click="link_input"
            />
            <Button
                color="orange"
                className={styles.addBtn}
                onClick={addBlogHandler}
                isLoading={loading}
                data-analytics-click="add_button"
            >
                <span>{!loading ? 'Add' : 'Loading'}</span>
            </Button>
        </Popup>
    );
};

export default BlogsAdd;
