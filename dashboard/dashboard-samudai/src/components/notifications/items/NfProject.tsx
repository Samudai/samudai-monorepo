import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import Progress from 'ui/Progress/Progress';
import BookIcon from 'ui/SVG/BookIcon';
import CommentsIcon from 'ui/SVG/CommentsIcon';
import Notification from 'ui/SVG/Notification';
import PeopleIcon from 'ui/SVG/PeopleIcon';
import { NfCard } from '../elements';
import styles from '../styles/items/NfProject.module.scss';

interface NfProjectProps {}

const NfProject: React.FC<NfProjectProps> = (props) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colTitle)}>
                <BookIcon className={styles.book} />
                <p className={styles.title}>Sleep app project</p>
            </li>
            <li className={clsx(styles.col, styles.colProgress)}>
                <p className="nf-title">Progect Progress</p>
                <Progress className={styles.progress} percent={48} />
            </li>
            <li className={clsx(styles.col, styles.colInfo)}>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <PeopleIcon className={styles.listItemIcon} />
                        <p className={styles.listItemValue}>28</p>
                    </li>
                    <li className={styles.listItem}>
                        <CommentsIcon className={styles.listItemIcon} />
                        <p className={styles.listItemValue}>28</p>
                    </li>
                    <li className={clsx(styles.listItem, styles.listItemActive)}>
                        <Notification className={styles.listItemIcon} />
                    </li>
                </ul>
            </li>
            <li className={clsx(styles.col, styles.colControl)}>
                <Button color="black" className={clsx(styles.controlBtn, styles.controlBtnCancel)}>
                    <span>Cancel</span>
                </Button>
                <Button color="green" className={clsx(styles.controlBtn, styles.controlBtnAccept)}>
                    <span>To accept</span>
                </Button>
            </li>
        </NfCard>
    );
};

export default NfProject;
