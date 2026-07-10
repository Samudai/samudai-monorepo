import { IClanInfoEarnedBadges } from 'utils/types/Clan';
import styles from '../../styles/Widgets.module.scss';

interface ClanBadgesProps {
    earnedBadges: IClanInfoEarnedBadges[];
}

const ClanBadges: React.FC<ClanBadgesProps> = ({ earnedBadges }) => {
    return (
        <div className={styles.widget}>
            <header className={styles.header}>
                <h3 className={styles.title}>Earned Badges</h3>
            </header>
            <div className={styles.badgesContent}>
                <ul className={styles.badgesList}>
                    {earnedBadges.map((item) => (
                        <li className={styles.badgesItem} key={item.id}>
                            <img className={styles.badgesImg} src={item.icon} alt="icon" />
                            <p className={styles.badgesCount}>{item.count}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClanBadges;
