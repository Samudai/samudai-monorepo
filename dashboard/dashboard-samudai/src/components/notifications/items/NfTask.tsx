import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import TextOverflow from 'ui/TextOverflow/TextOverflow';
import { NfCard } from '../elements';
import styles from '../styles/items/NfTask.module.scss';

interface NfTaskProps {}

const mockMembers = [
    '/mockup/img/user-1.png',
    '/mockup/img/user-2.png',
    '/mockup/img/user-3.png',
    '/img/icons/user-4.png',
];

const NfTask: React.FC<NfTaskProps> = (props) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colTask)}>
                <p className={styles.title}>Task</p>
                <TextOverflow className={styles.taskName}>Meeting with customer</TextOverflow>
            </li>
            <li className={clsx(styles.col, styles.colProject)}>
                <p className={styles.title}>Project</p>
                <TextOverflow className={styles.projectName}>Sleep app </TextOverflow>
            </li>
            <li className={clsx(styles.col, styles.colStatus)}>
                <p className={clsx('nf-title', styles.status)}>In - Review</p>
            </li>
            <li className={clsx(styles.col, styles.colDepartment)}>
                <p className={clsx('nf-title', styles.department)}>Design</p>
            </li>
            <li className={clsx(styles.col, styles.colDate)}>
                <p className="nf-title">1h ago</p>
            </li>
            {/* <li className={clsx(styles.col, styles.colMembers)}>
        <Members max={4} hideMore users={mockMembers} className={styles.members} />
      </li> */}
            <li className={clsx(styles.col, styles.colControls)}>
                <Button color="green" className={styles.controlBtn}>
                    <span>View</span>
                </Button>
            </li>
        </NfCard>
    );
};

export default NfTask;
