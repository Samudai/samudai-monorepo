import React from 'react';
import Popup from '../Popup/Popup';
import PopupBox from '../PopupBox/PopupBox';
import styles from '../styles/Filter.module.scss';

interface FilterProps {
    active: boolean;
    children?: React.ReactNode;
    onClose: () => void;
}

const Filter: React.FC<FilterProps> = ({ active, onClose, children }) => {
    return (
        <PopupBox active={active} onClose={onClose} className={styles.root}>
            <React.Fragment>
                <Popup className={styles.popup}>{children}</Popup>
            </React.Fragment>
        </PopupBox>
    );
};

export default Filter;
