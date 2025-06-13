import clsx from 'clsx';
import Progress from 'ui/Progress/Progress';
import { NfCard } from '../elements';
import styles from '../styles/items/NfProposal.module.scss';

interface NfProposalProps {}

const NfProposal: React.FC<NfProposalProps> = (props) => {
    return (
        <NfCard component="ul" className={styles.root}>
            <li className={clsx(styles.col, styles.colTitle)}>
                <p className="nf-title">Reques for verification of ABToken</p>
            </li>
            <li className={clsx(styles.col, styles.colVotesFor)}>
                <Progress hideText percent={80} className={styles.rating} />
                <p className={clsx('nf-title', styles.votes)}>
                    <strong>120</strong> votes
                </p>
            </li>
            <li className={clsx(styles.col, styles.colVotesAgainst)}>
                <Progress hideText percent={80} className={styles.rating} />
                <p className={clsx('nf-title', styles.votes)}>
                    <strong>60</strong> votes
                </p>
            </li>
            <li className={clsx(styles.col, styles.colStatus)}>
                <p className={styles.status}>Active</p>
            </li>
            <li className={clsx(styles.col, styles.colTime)}>
                <p className="nf-title">1h ago</p>
            </li>
        </NfCard>
    );
};

export default NfProposal;
