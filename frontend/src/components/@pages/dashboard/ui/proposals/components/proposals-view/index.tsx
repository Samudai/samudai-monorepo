import Button from 'ui/@buttons/Button/Button';
import styles from './proposals-view.module.scss';

interface ProposalViewProps {
    title: string;
    status: string;
    onDetails: () => void;
    id?: string;
}

export const ProposalsView: React.FC<ProposalViewProps> = ({ onDetails, status, title, id }) => {
    return (
        <li className={styles.root}>
            <div className={styles.col + ' ' + styles.colTitle}>
                <h3 className={styles.title}>{title}</h3>
            </div>
            <div className={styles.col + ' ' + styles.colStatus}>
                <div className={styles.status} data-status={status.toLowerCase()}>
                    {status}
                </div>
            </div>
            <div className={styles.col + ' ' + styles.colBtn}>
                <Button
                    color="green"
                    className={styles.viewBtn}
                    onClick={onDetails}
                    data-analytics-click={`view_proposal_${id}`}
                >
                    <span>View</span>
                </Button>
            </div>
        </li>
    );
};
