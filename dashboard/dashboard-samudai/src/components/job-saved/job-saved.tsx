import React from 'react';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import styles from './job-saved.module.scss';
import { beautifySum } from 'utils/format';
import LocationIcon from 'ui/SVG/LocationIcon';

interface JobSavedProps {
    id: string;
    title: string;
    isSaved: boolean;
    experience: number;
    bounty: number;
    type: string;
}

const JobSaved: React.FC<JobSavedProps> = ({ bounty, experience, id, isSaved, title, type }) => {
    return (
        <li className={styles.job}>
            <header className={styles.job_head}>
                <h4 className={styles.job_title}>{title}</h4>
                <button className={styles.job_saveBtn}>
                    <ArchiveIcon className={isSaved && styles.job_saveBtn_saved} />
                </button>
            </header>
            {/* <SkillList skills={[]} className={styles.job_skills} /> */}
            <footer className={styles.job_foot}>
                <div className={styles.job_info}>
                    <h5 className={styles.job_info_title}>Experience</h5>{' '}
                    <p className={styles.job_info_val}>{experience / 12} Years</p>
                </div>
                <div className={styles.job_info}>
                    <h5 className={styles.job_info_title}>Bounty $</h5>
                    <p className={styles.job_info_val}>{beautifySum(bounty)}</p>
                </div>
                <div className={styles.job_info}>
                    <h5 className={styles.job_info_title}>
                        <LocationIcon />
                    </h5>{' '}
                    <p className={styles.job_info_val}>{type}</p>
                </div>
            </footer>
        </li>
    );
};

export default JobSaved;
