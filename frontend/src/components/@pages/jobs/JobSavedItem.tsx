import clsx from 'clsx';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import { JobRole } from 'utils/types/Jobs';
import styles from './styles/JobSavedItem.module.scss';

interface JobSavedItemProps {
    className?: string;
    title: string;
    skills: string[];
    department: string;
    openTo: JobRole[];
    payoutAmount: number;
    payoutCurrency: string;
    minPeople: number;
}

const JobSavedItem: React.FC<JobSavedItemProps> = (props) => {
    return (
        <div className={clsx(styles.root, props.className)}>
            <header className={styles.head}>
                <h3 className={styles.headTitle}>{props.title}</h3>
                <ArchiveIcon className={styles.headArchive} />
            </header>
            <div className={styles.skills}>
                {/* <SkillList
          className={styles.skillsList}
          skills={props.skills.slice(0, 2).map((s) => SkillHelper.create(s))}
        /> */}
            </div>
            <ul className={styles.info}>
                <li className={styles.infoCol}>
                    <p className={styles.infoItem}>
                        Department <strong>{props.department}</strong>
                    </p>
                    <p className={styles.infoItem}>
                        Open to{' '}
                        <strong>
                            {props.openTo.map((r, i, a) => (
                                <span key={i}>
                                    {r}
                                    {i !== a.length - 1 && ', '}
                                </span>
                            ))}
                        </strong>
                    </p>
                </li>
                <li className={clsx(styles.infoCol, styles.infoColRight)}>
                    <p className={styles.infoItem}>
                        Payout <strong>{props.payoutAmount + '' + props.payoutCurrency}</strong>
                    </p>
                    <p className={styles.infoItem}>
                        Min of people <strong>{props.minPeople}</strong>
                    </p>
                </li>
            </ul>
        </div>
    );
};

export default JobSavedItem;
