import React from 'react';
import { useParams } from 'react-router-dom';
import { selectActiveDaoName } from 'store/features/common/slice';
import { useSnapshotAuthMutation } from 'store/services/Login/login';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import TextArea from 'ui/@form/TextArea/TextArea';
import { getInitial } from 'utils/utils';
import styles from './about-fulltext.module.scss';

interface ShowTextProps {
    onCloseModal?: () => void;
    title?: string;
    text: string;
}

export const AboutFullText: React.FC<ShowTextProps> = ({ onCloseModal, text, title }) => {
    const [snapshotAuth] = useSnapshotAuthMutation();
    const { daoid } = useParams();
    const [spaceId, setSpaceId] = useInput('');
    const daoName = useTypedSelector(selectActiveDaoName);
    const initial = getInitial(daoName);

    return (
        <React.Fragment>
            <PopupTitle icon={'/img/icons/about.png'} title={title || ''} />
            <TextArea
                title=""
                disabled
                value={text}
                // onChange={setSpaceId}
                className={styles.input}
                style={{ color: '#a0a0a0e0' }}
            />
            {/* <Button color="green" className={styles.doneBtn}>
        <span>Done</span>
      </Button> */}
        </React.Fragment>
    );
};
