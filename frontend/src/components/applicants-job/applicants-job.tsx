import React from 'react';
import clsx from 'clsx';
import styles from './applicants-job.module.scss';

interface ApplicantsJobProps {}

const ApplicantsJob: React.FC<ApplicantsJobProps> = (props) => {
    return (
        <div className={styles.job}>
            <p className={clsx(styles.job_col, styles.job_colTitle)}>Product Designer</p>
            <p className={clsx(styles.job_col, styles.job_colDepartment)}>Design</p>
            <p className={clsx(styles.job_col, styles.job_colType)}>
                <span className={styles.job_title}>Job Type</span> <span>Full Time</span>
            </p>
            <p className={clsx(styles.job_col, styles.job_colExp)}>
                <span className={styles.job_title}>Experience</span> <span>2 Years</span>
            </p>
            <p className={clsx(styles.job_col, styles.job_colCreatedAt)}>Posted 6 day ago</p>
            <p className={clsx(styles.job_col, styles.job_colApplicants)}>
                <span className={styles.job_applicants}>9 Applicants</span>
            </p>
        </div>
    );
};

export default ApplicantsJob;
