import { getJobDefaultFilter } from './utils/defaultFilter';
import { JobFilter } from 'utils/types/Jobs';
import JobCriteria from './JobCriteria';
import styles from './styles/JobFilters.module.scss';

interface JobFiltersProps {
    filter: JobFilter;
    bounty: {
        min: number;
        max: number;
    };
    setFilter: (f: JobFilter) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ bounty, filter, setFilter }) => {
    const removeMinBounty = () => {
        setFilter({ ...filter, bounty: { ...filter.bounty, min: bounty.min } });
    };

    const removeMaxBounty = () => {
        setFilter({ ...filter, bounty: { ...filter.bounty, max: bounty.max } });
    };

    const removeRole = (role: string) => {
        setFilter({ ...filter, role: filter.role.filter((r) => r !== role) });
    };

    const removeAllFilters = () => {
        setFilter({ ...getJobDefaultFilter(), bounty });
    };

    return !filter.all ? (
        <div className={styles.root}>
            <ul className={styles.list}>
                {bounty.min !== filter.bounty.min && (
                    <li className={styles.item}>
                        <JobCriteria
                            name={`Min: $${filter.bounty.min}`}
                            onClick={removeMinBounty}
                        />
                    </li>
                )}
                {bounty.max !== filter.bounty.max && (
                    <li className={styles.item}>
                        <JobCriteria
                            name={`Max: $${filter.bounty.max}`}
                            onClick={removeMaxBounty}
                        />
                    </li>
                )}
                {filter.role.map((role) => (
                    <li key={role} className={styles.item}>
                        <JobCriteria name={role} onClick={removeRole.bind(null, role)} key={role} />
                    </li>
                ))}
                {!filter.all && (
                    <li className={styles.item}>
                        <button className={styles.clearAllBtn} onClick={removeAllFilters}>
                            Clear All
                        </button>
                    </li>
                )}
            </ul>
        </div>
    ) : null;
};

export default JobFilters;
