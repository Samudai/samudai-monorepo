import BarChart from 'components/BarChart/BarChart';
import { IClanInfoBounty } from 'utils/types/Clan';
import styles from '../../styles/Widgets.module.scss';

interface ClanBountyProps {
    bounty: IClanInfoBounty;
}

const ClanBounty: React.FC<ClanBountyProps> = ({ bounty }) => {
    return (
        <div className={styles.widget}>
            <div className={styles.bounty}>
                <div className={styles.bountyLeft}>
                    <h4 className={styles.bountyTitle}>Total Bounty</h4>
                    <div className={styles.bountyData}>
                        <p className={styles.bountyName}>Bounty</p>
                        <p className={styles.bountyValue}>{bounty.value} %</p>
                    </div>
                </div>
                <div className={styles.bountyRight}>
                    <div className={styles.bountyChart}>
                        <BarChart data={bounty.data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClanBounty;
