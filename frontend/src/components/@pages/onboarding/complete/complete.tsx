import React from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../board/board';
import Button from 'ui/@buttons/Button/Button';
import MarkIcon from 'ui/SVG/MarkIcon';
import styles from './complete.module.scss';

interface CompleteProps {}

const Complete: React.FC<CompleteProps> = (props) => {
    const navigate = useNavigate();

    return (
        <Board title="Completed" icon="/img/icons/complete.png">
            <div className={styles.complete_icon}>
                <MarkIcon />
            </div>
            <p className={styles.complete_text}>Thank you, setup completed!</p>
            <Button
                className={styles.complete_btn}
                onClick={() => navigate('/dashboard')}
                color="green"
            >
                <span>Complete</span>
            </Button>
        </Board>
    );
};

export default Complete;
