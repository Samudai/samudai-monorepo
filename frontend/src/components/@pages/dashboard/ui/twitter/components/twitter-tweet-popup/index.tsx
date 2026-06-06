import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectActiveDao } from 'store/features/common/slice';
import { useAddTweetMutation } from 'store/services/Dashboard/dashboard';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import styles from 'components/@popups/BlogsAdd/BlogsAdd.module.scss';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';

interface AddTweetPopupProps {
    onClose: () => void;
}

export const TwitterTweetPopup: React.FC<AddTweetPopupProps> = ({ onClose }) => {
    const [link, setLink, _, clearLink] = useInput('');
    const [loading, setLoading] = useState(false);
    const [addTweet] = useAddTweetMutation();
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const handleAddTweet = async () => {
        if (link.length === 0) {
            toast('Failure', 5000, 'Input Field cannot be empty', '')();
            return;
        }
        setLoading(true);
        const id = link.split('/').slice(-1)[0];
        addTweet({ tweetId: id, linkId: daoid! })
            .unwrap()
            .then(() => {
                setLoading(false);
                clearLink();
                onClose();
            })
            .catch(() => {
                toast('Failure', 5000, 'Adding featured tweet failed', '')();
                setLoading(false);
            });
    };
    return (
        <Popup className={styles.root}>
            <PopupTitle icon="/img/icons/file.png" title="Add Tweet" />
            <Input
                placeholder="Tweet link"
                className={styles.input}
                value={link}
                onChange={setLink}
            />
            <Button
                color="orange"
                className={styles.addBtn}
                onClick={handleAddTweet}
                isLoading={loading}
            >
                <span>{!loading ? 'Add' : 'Loading'}</span>
            </Button>
        </Popup>
    );
};
