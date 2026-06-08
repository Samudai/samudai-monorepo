import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import Rating from 'ui/Rating/Rating';
import LocationIcon from 'ui/SVG/LocationIcon';
import MedalIcon from 'ui/SVG/MedalIcon';
import ChartIcons from 'ui/SVG/chart';
import UserSkill from 'ui/UserSkill/UserSkill';
import { IUser } from 'utils/types/User';
import styles from '../styles/UserProfileDetails.module.scss';

interface IMember {
  member_id: string;
  username: string;
  profile_picture?: string | null;
}

interface UserProfileDetailsProps {
  profile: IMember | null;
}

const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({ profile }) => {
  const [fetchMember, { data }] = useGetMemberByIdMutation({
    fixedCacheKey : profile?.member_id,
  });
  const [memberData, setMemberData] = useState<any>(null);
  
  const AfterFetch = (res: any) => {
    setMemberData(res.data?.member);
  }
  
  useEffect(() => {

    if(data){
      AfterFetch(data);
    }
    else{
      fetchMember({
          member: { type: 'member_id', value: profile!.member_id },
      })
      .unwrap()
      .then((res) => {
        AfterFetch(res);
      });
    }
    
  }, []);

  if (!profile) return null;

  return (
    <React.Fragment>
      <div className={styles.title}>User Profile Details</div>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.userImg}>
            <img src={memberData?.profile_picture} alt="avatar" className="img-cover" />
          </div>
          <p className={styles.userName}>{memberData?.name}</p>
          <p className={styles.userProff}>Senior UI Designer</p>
          <p className={styles.userLink}>@{memberData?.username}</p>
        </div>
        {/* <div className={styles.right}>
          <p className={clsx(styles.userRating, styles[memberData.rating[0].toLowerCase()])}>
            Rating: <strong>{memberData.rating}</strong>
          </p>
          <div className={styles.rate}>
            <p className={styles.rateLabel}>5.0</p>
            <Rating className={styles.rateRating} rate={5.0} />
          </div>
          <ul className={styles.info}>
            <li className={styles.infoItem}>
              <LocationIcon className={styles.infoIcon} />
              <p className={styles.infoValue}>{memberData.location}</p>
            </li>
            <li className={styles.infoItem}>
              <MedalIcon className={styles.infoIcon} />
              <p className={styles.infoValue}>Сredibility score in community : 200</p>
            </li>
            <li className={styles.infoItem}>
              <ChartIcons.Contributors className={styles.infoIcon} />
              <p className={styles.infoValue}>{memberData.role} Role</p>
            </li>
          </ul>
        </div> */}
      </div>
      <h5 className={styles.subtitle}>Bio</h5>
      <p className={styles.text}>{memberData?.about}</p>
      <h5 className={styles.subtitle}>Skills</h5>
      <div className={styles.skills}>
        <ul className={styles.skillsList}>
          {memberData?.skills?.map((skill: any) => (
            <UserSkill key={skill} className={styles.skillsItem} skill={skill} />
          ))}
        </ul>
      </div>
      {/* <h5 className={styles.subtitle}>
        Tips/Bounty <strong>{memberData.}</strong>
      </h5> */}
    </React.Fragment>
  );
};

export default UserProfileDetails;
