import { getMemberByIdResponse } from 'store/services/userProfile/model';
import { ReviewsNew } from 'components/@pages/dashboard';
import ActiveProjects from 'components/@pages/profile/elements/ActiveProjects';
import EarnedBadges from 'components/@pages/profile/elements/EarnedBadges';
import FavoriteDao from 'components/@pages/profile/elements/FavoriteDao/FavoriteDao';
import Skills from 'components/@pages/profile/elements/Skills';
import SocialPortfolio from 'components/@pages/profile/elements/SocialPortfolio';
import UpcomingEvents from 'components/@pages/profile/elements/UpcomingEvents';
import styles from '../styles/Profile.module.scss';

interface IProps {
    userData: getMemberByIdResponse;
}

const Profile: React.FC<IProps> = ({ userData }) => {
    return (
        <div className={styles.table} style={{ marginBottom: '70px' }}>
            <div className={styles.tableLeft}>
                <SocialPortfolio social={userData?.data?.socials} />
                <Skills skills={userData?.data?.member.skills} />
                <UpcomingEvents />
                <FavoriteDao />
                {/* <SavedJobs /> */}
                {/* <Bounty /> */}
            </div>
            <div className={styles.tableRight}>
                <EarnedBadges />
                <ActiveProjects />
                <ReviewsNew />
            </div>
        </div>
    );
};

export default Profile;
