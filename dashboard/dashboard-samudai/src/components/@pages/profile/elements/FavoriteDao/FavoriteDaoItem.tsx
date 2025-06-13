import { useNavigate } from 'react-router-dom';
import styles from 'components/UserProfile/styles/UserStat.module.scss';
import HeartIcon from 'ui/SVG/HeartIcon';
import VerifyIcon from 'ui/SVG/VerifyIcon';

const FavoriteDaoItem: React.FC<any> = ({ dao_id, profile_picture, name, id, verified }) => {
    const navigate = useNavigate();
    const getInitial = (name: string) => {
        // .replaceAll(/\.|\w|\-|\_/g, ',')
        const output = name
            .split('.')
            .join(',')
            .split(' ')
            .join(',')
            .split('-')
            .join(',')
            .split('_')
            .join(',');

        const initials = output
            .split(',')
            .map((val) => val[0])
            .join('');
        return initials.slice(0, 2).toUpperCase();
    };
    return (
        <li className="favorite-dao-item" onClick={() => navigate(`/${dao_id}/dashboard/1`)}>
            <div className="favorite-dao-item__img">
                {profile_picture ? (
                    <img src={profile_picture || '/img/icons/user-4.png'} alt="img" />
                ) : (
                    <span className={styles.buttonIcon}>{getInitial(name)}</span>
                )}
            </div>
            <div className="favorite-dao-item__content">
                <h3 className="favorite-dao-item__name">
                    <span>{name}</span>
                    {verified && <VerifyIcon />}
                </h3>
                <p className="favorite-dao-item__id">{name}</p>
            </div>
            <div className="favorite-dao-item__heart">
                <HeartIcon />
            </div>
        </li>
    );
};

export default FavoriteDaoItem;
