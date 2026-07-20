import clsx from 'clsx';
import { useScrollbar } from 'hooks/useScrollbar';
import Popup from 'components/@popups/components/Popup/Popup';
import CloseButton from 'ui/@buttons/Close/Close';
import styles from '../styles/JobSaved.module.scss';
import { OpportunityResponse } from 'utils/types/Jobs';
import JobItem from '../JobItem';

interface JobSavedProps {
    jobs: OpportunityResponse[];
    onClose?: () => void;
    onDetail?: (job: OpportunityResponse) => void;
}

const JobSaved: React.FC<JobSavedProps> = ({ jobs, onClose, onDetail }) => {
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();
    return (
        <Popup className={styles.root}>
            <header className={styles.head}>
                <h2 className={styles.title}>Saved Jobs</h2>
                <CloseButton className={styles.closeBtn} onClick={onClose} />
            </header>
            <div
                className={clsx('orange-scrollbar', styles.saved, isScrollbar && styles.savedPd)}
                ref={ref}
            >
                <ul className={styles.list}>
                    {jobs.map((item) => (
                        <JobItem
                            type="card"
                            title={item.title}
                            tags={item.tags}
                            payoutCurrency={item.payout_currency}
                            payoutAmount={item.payout_amount}
                            openTo={item.open_to}
                            minPeople={item.req_people_count}
                            department={item.department || 'All'}
                            saved
                            key={item.job_id}
                            onDetail={() => onDetail?.(item)}
                        />
                    ))}
                </ul>
            </div>
        </Popup>
    );
};

export default JobSaved;
