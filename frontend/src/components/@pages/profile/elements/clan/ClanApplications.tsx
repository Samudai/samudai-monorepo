import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import UserSkill from 'ui/UserSkill/UserSkill';
import { IClanInfoApplication } from 'utils/types/Clan';
import styles from '../../styles/Widgets.module.scss';

interface ClanApplicationsProps {
    applications: IClanInfoApplication[];
}

const ClanApplications: React.FC<ClanApplicationsProps> = ({ applications }) => {
    return (
        <div className={styles.widget}>
            <header className={styles.header}>
                <h3 className={styles.title}>Recent Applications</h3>
            </header>
            <div className={styles.apContent}>
                <ul className={styles.apList}>
                    {applications.map((ap) => (
                        <li className={styles.ap_item} key={ap.id}>
                            <div className={clsx(styles.ap_item_col, styles.ap_item_col_title)}>
                                <h3 className={styles.ap_item_title}>{ap.title}</h3>
                                <div className={styles.ap_item_skills}>
                                    {ap.skills.slice(0, 2).map((skill) => (
                                        <UserSkill
                                            hideCross
                                            className={styles.ap_item_skills_item}
                                            key={skill.id}
                                            skill={skill.name}
                                        />
                                    ))}
                                    {ap.skills.length > 2 && (
                                        <div className={styles.ap_item_skills_more}>
                                            +{ap.skills.length - 2}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={clsx(styles.ap_item_col, styles.ap_item_col_people)}>
                                <h3 className={styles.ap_item_ttl}>Min People</h3>
                                <p className={styles.ap_item_val}>{ap.min_people}</p>
                            </div>
                            <div className={clsx(styles.ap_item_col, styles.ap_item_col_payout)}>
                                <h3 className={styles.ap_item_ttl}>Payout</h3>
                                <p className={styles.ap_item_val}>{ap.payout}</p>
                            </div>
                            <div className={clsx(styles.ap_item_col, styles.ap_item_col_roles)}>
                                <p className={styles.ap_item_val}>{ap.open_roles.join(', ')}</p>
                            </div>
                            <div className={clsx(styles.ap_item_col, styles.ap_item_col_btn)}>
                                <NavLink className={styles.ap_item_view} to="#">
                                    View Application
                                </NavLink>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClanApplications;
