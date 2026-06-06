import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import routes from 'root/router/routes';
import { replaceParam } from 'root/router/utils';
import {
  useCreateFavDaoMutation,
  useRemoveFavDaoMutation,
} from 'store/services/Discovery/Discovery';
import Button from 'ui/@buttons/Button/Button';
import BookIcon from 'ui/SVG/BookIcon';
import HeartIconDiscovery from 'ui/SVG/HeartIconDiscovery';
import HeartIconWhite from 'ui/SVG/HeartIconWhite';
import ProfileUsersIcon from 'ui/SVG/ProfileUsersIcon';
import RoundedDollarIcon from 'ui/SVG/RoundedDollarIcon';
import UserInfo from 'ui/UserInfo/UserInfo';
import UserSkill from 'ui/UserSkill/UserSkill';
import { toast } from 'utils/toast';
import { DiscoveryUser } from 'utils/types/Discovery';
import { getMemberId } from 'utils/utils';
import styles from '../styles/DiscoveryCard.module.scss';
import HeartStrokedIcon from 'ui/SVG/HeartStrokedIcon';

interface DiscoveryCardProps {
  type: 'dao' | 'profile';
  data: any;
  favDaoId: string;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ type, data, favDaoId: fav }) => {
  const navigate = useNavigate();
  const [favDaoId, setFavDoId] = useState(fav);
  const [show, setShow] = useState(!!favDaoId);
  const [createFavDao] = useCreateFavDaoMutation();
  const [removeFavDao] = useRemoveFavDaoMutation();

  const handleClickButton = () => {
    if (type === 'dao') {
      navigate(`/${data?.dao_id}/dashboard/1`);
    } else {
      // Navigate to user
      navigate(`/${data?.member_id}/profile`);
    }
  };

  const favouriteDao = async (e: any) => {
    e.stopPropagation();
    setShow(true);
    try {
      const payload = {
        favouriteDAO: {
          dao_id: data?.dao_id,
          member_id: getMemberId(),
        },
      };
      const res = await createFavDao(payload).unwrap();
      setFavDoId(res?.data?.favourite_id);
    } catch (err) {
      setShow(false);
      console.error('cannot favourite dao: ', err);
    }
  };
  const removeFavourite = async (e: any) => {
    e.stopPropagation();
    setShow(false);
    try {
      const res = await removeFavDao(favDaoId).unwrap();
    } catch (err) {
      setShow(false);
      console.error('cannot remove favourite dao: ', err);
    }
  };

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
    <div
      className={clsx(styles.root, styles[type])}
      onClick={handleClickButton}
      style={{ cursor: 'pointer' }}
      data-class="card"
    >
      <div className={styles.wrapper}>
        <header className={styles.head} style={{ marginBottom: '10px' }}>
          {type !== 'dao' && (
            <UserInfo
              data={{
                member_id: data.member_id,
                username: data.username,
                profile_picture: data.profile_picture,
                name: data.name,
              }}
              removeRating
              className={styles.user}
            />
          )}
          {type === 'dao' && (
            <UserInfo
              data={{
                member_id: data.dao_id,
                username: data.name,
                profile_picture: data.profile_picture,
                name: data.name,
              }}
              initial={getInitial(data.name)}
              removeRating
              className={styles.user}
            />
          )}
          {type === 'dao' && (
            <>
              {!show && (
                <div
                  className={clsx('favorite-dao-item__heart_white', styles.headBtn, styles.headBtnHeart)}
                  onClick={favouriteDao}
                >
                  <HeartStrokedIcon />
                </div>
              )}
              {show && (
                <div
                  style={{ opacity: '100' }}
                  className={clsx('favorite-dao-item__heart_red', styles.headBtn)}
                  onClick={removeFavourite}
                >
                  <HeartIconDiscovery />
                </div>
              )}
            </>
          )}
        </header>
        <div className={styles.body}>
          <ul className={styles.info}>
            {type === 'dao' && (
              <li className={styles.infoItem}>
                <p className={styles.infoTitle}>Open Bounties</p>
                <div className={styles.infoRow}>
                  <RoundedDollarIcon className={styles.infoIcon} data-clr-orange />
                  <p className={styles.infoValue}>{data?.bounties_open || '...'}</p>
                </div>
              </li>
            )}
            {type === 'dao' && (
              <li className={styles.infoItem}>
                <p className={styles.infoTitle}>Team Size</p>
                <div className={styles.infoRow}>
                  <ProfileUsersIcon className={styles.infoIcon} data-clr-lavender />
                  <p className={styles.infoValue}>{'...'}</p>
                </div>
              </li>
            )}
            {type === 'profile' && (
              <li className={styles.infoItem}>
                <ul className={styles.infoSkills}>
                  {data.skills.slice(0, 2).map((skill: string) => (
                    <UserSkill
                      className={styles.infoSkillsItem}
                      skill={skill}
                      key={skill}
                      hideCross
                    />
                  ))}
                </ul>
              </li>
            )}
            <li className={styles.infoItem}>
              <p className={styles.infoTitle}>Ongoing Projects</p>
              <div className={styles.infoRow}>
                <BookIcon className={styles.infoIcon} data-clr-green />
                <p className={styles.infoValue}>{data?.projects_ongoing || '0'}</p>
              </div>
            </li>
            {type === 'profile' && (
              <li className={styles.infoItem}>
                <p className={styles.infoTitle}>Bounty Earned</p>
                <div className={styles.infoRow}>
                  <RoundedDollarIcon className={styles.infoIcon} data-clr-orange />
                  <p className={styles.infoValue}>
                    ...{/* ${(data.bounty_earned / 1000).toFixed(0)}K */}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCard;
