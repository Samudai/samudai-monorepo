import { NfPerson } from '../elements/Components';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import { cutText } from 'utils/format';
import { NfCard } from '../elements';
import styles from '../styles/items/NfMessage.module.scss';

interface NfMessageProps {}

const NfMessage: React.FC<NfMessageProps> = (props) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colPerson)}>
                <NfPerson img="/img/icons/user-4.png" name="Phyllis Hall" />
            </li>
            <li className={clsx(styles.col, styles.colMsg)}>
                <p className="nf-title">
                    {cutText(
                        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe mollitia explicabo voluptates id quisquam laboriosam alias vitae totam accusantium eos!',
                        71
                    )}
                </p>
            </li>
            <li className={clsx(styles.col, styles.colTime)}>
                <p className="nf-title">12 Feb,2022</p>
                <p className={clsx('nf-title', styles.time)}>9:00 AM</p>
            </li>
            <li className={clsx(styles.col, styles.colFiles)}>
                <img
                    src="/img/icons/view-attachments.svg"
                    alt="files"
                    className={styles.filesIcon}
                />
                <p className={clsx('nf-title', styles.filesCount)}>2 files</p>
            </li>
            <li className={clsx(styles.col, styles.colLink)}>
                <p className="nf-title">@alenawilliams01</p>
            </li>
            <li className={clsx(styles.col, styles.colControl)}>
                <Button color="green" className={styles.replyBtn}>
                    <span>Reply</span>
                </Button>
            </li>
        </NfCard>
    );
};

export default NfMessage;
