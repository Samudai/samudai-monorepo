import React from 'react';
import { mockup_jobs } from 'root/mockup/jobs';
import JobSaved from 'components/job-saved/job-saved';
import styles from './styles/latest-jobs.module.scss';

interface LatestJobsProps {}

const LatestJobs: React.FC<LatestJobsProps> = (props) => {
    return (
        <div className={styles.jobs}>
            <header className={styles.jobs_head}>
                <h2 className={styles.jobs_title}>Latest Jobs</h2>
                <button className={styles.jobs_all}>View All</button>
            </header>
            <ul className={styles.jobs_list}>
                {mockup_jobs.slice(0, 2).map((item, id) => (
                    <JobSaved
                        title={item.title}
                        bounty={12000}
                        experience={24}
                        id={item.job_id}
                        isSaved={Math.random() - 0.5 > 0}
                        type="remote"
                        key={item.job_id}
                    />
                ))}
            </ul>
        </div>
    );
};

export default LatestJobs;
