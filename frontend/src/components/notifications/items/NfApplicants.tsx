import { NfPerson } from '../elements/Components';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import { cutText } from 'utils/format';
import { NfCard } from '../elements';
import styles from '../styles/items/NfApplicants.module.scss';

interface NfApplicantsProps {}

const NfApplicants: React.FC<NfApplicantsProps> = (props) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colPerson)}>
                <NfPerson
                    img="/img/icons/user-4.png"
                    name="Phyllis Hall"
                    subtext="San Francisco, California"
                />
            </li>
            <li className={clsx(styles.col, styles.colRating)}>
                <p className={styles.rating}>C+</p>
            </li>
            <li className={clsx(styles.col, styles.colMsg)}>
                <p className={styles.text}>
                    {cutText(
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Consectetur adipiscing elit, sed do eiusmod.',
                        71
                    )}
                </p>
            </li>
            <li className={clsx(styles.col, styles.colDate)}>
                <p className="nf-title">12 Feb,2022</p>
            </li>
            <li className={clsx(styles.col, styles.colLink)}>
                <p className="nf-title">@alenawilliams01</p>
            </li>
            <li className={clsx(styles.col, styles.colControl)}>
                <Button color="black" className={styles.viewBtn}>
                    <span>View</span>
                </Button>
            </li>
        </NfCard>
    );
};

export default NfApplicants;
