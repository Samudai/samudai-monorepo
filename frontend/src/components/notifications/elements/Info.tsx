import styles from '../styles/Info.module.scss';
import Label from './Label';

const NfInfo: React.FC = (props) => {
    return (
        <div className={styles.root}>
            <ul className={styles.list}>
                <li className={styles.item}>
                    <Label type="actions" />
                    <span className={styles.name}>Actionables</span>
                </li>
                <li className={styles.item}>
                    <Label type="information" />
                    <span className={styles.name}>Information</span>
                </li>
                <li className={styles.item}>
                    <Label type="alert" />
                    <span className={styles.name}>Alert </span>
                </li>
            </ul>
        </div>
    );
};

export default NfInfo;
