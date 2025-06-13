import React, { useState } from 'react';
import ApplicantsItem from 'components/applicants-item/applicants-item';
import ApplicantsJob from 'components/applicants-job/applicants-job';
import Back from 'ui/@buttons/Back/Back';
import ArrowDownIcon from 'ui/SVG/ArrowDownIcon';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import styles from 'styles/pages/applicants.module.scss';

interface ApplicantsProps {}

enum Tabs {
    PROJECT = 'Project',
    TASK = 'Task',
    BOUNTY = 'Bounty',
}

const Applicants: React.FC<ApplicantsProps> = (props) => {
    const [activeTab, setActiveTab] = useState(Tabs.PROJECT);

    return (
        <div className={styles.applicants} data-analytics-page="jobs_applicants_page">
            <div className="container">
                <header className={styles.applicants_head}>
                    <h1 className={styles.applicants_title}>Applicants</h1>
                    <Back className={styles.applicants_backBtn} title="Jobs Page" to="/jobs" />
                </header>
                <TabNavigation className={styles.applicants_tabs}>
                    {Object.values(Tabs).map((tab) => (
                        <TabNavigation.Button
                            active={tab === activeTab}
                            onClick={() => setActiveTab(tab)}
                            className={styles.applicants_tabs_item}
                            key={tab}
                        >
                            {tab}
                        </TabNavigation.Button>
                    ))}
                </TabNavigation>

                <div className={styles.applicants_table}>
                    <div className={styles.applicants_table_head}>
                        <h3 className={styles.applicants_table_title}>Jobs</h3>
                        <button
                            className={styles.applicants_table_btn}
                            data-analytics-click="see_all_jobs_btn"
                        >
                            <span>See All 9 Jobs</span>
                            <ArrowDownIcon />
                        </button>
                    </div>
                    <div className={styles.applicants_table_list}>
                        <ApplicantsJob />
                        <ApplicantsJob />
                        <ApplicantsJob />
                    </div>
                </div>

                <div className={styles.applicants_table}>
                    <div className={styles.applicants_table_head}>
                        <h3 className={styles.applicants_table_title}>Applicants</h3>
                        <button
                            className={styles.applicants_table_btn}
                            data-analytics-click="see_all_applicants_btn"
                        >
                            <span>See All 9 Applicants</span>
                            <ArrowDownIcon />
                        </button>
                    </div>
                    <div className={styles.applicants_table_list}>
                        <ApplicantsItem placeholder />
                        <ApplicantsItem />
                        <ApplicantsItem />
                        <ApplicantsItem />
                        <ApplicantsItem />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Applicants;
