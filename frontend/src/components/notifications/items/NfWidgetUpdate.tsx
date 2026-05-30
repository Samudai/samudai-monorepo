import { NfPerson } from '../elements/Components';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import { NfCard } from '../elements';
import styles from '../styles/items/NfWidgetUpdate.module.scss';

interface NfWidgetUpdateProps {}

const NfWidgetUpdate: React.FC<NfWidgetUpdateProps> = (props) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colPerson)}>
                <NfPerson img="/img/icons/user-4.png" name="Phyllis Hall" />
            </li>
            <li className={clsx(styles.col, styles.colAction)}>
                <p className="nf-title">Updated a widget Calendar info</p>
            </li>
            <li className={clsx(styles.col, styles.colTime)}>
                <p className="nf-title">1h ago</p>
            </li>
            <li className={clsx(styles.col, styles.colControl)}>
                <Button color="green" className={styles.controlBtn}>
                    <span>View</span>
                </Button>
            </li>
        </NfCard>
    );
};

export default NfWidgetUpdate;
