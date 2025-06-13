import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { changeProfilePicture } from 'store/features/common/slice';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';
import { getMemberByIdResponse } from 'store/services/userProfile/model';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch } from 'hooks/useStore';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import { getMemberId } from 'utils/utils';
import UserControls from './UserControls';
import UserInfo from './UserInfo';
import UserStat from './UserStat';
import styles from './styles/UserProfile.module.scss';
import clsx from 'clsx';

const UserProfile: React.FC = () => {
    const { memberid } = useParams();

    const [fetchUserProfile, { data: memberData }] = useGetMemberByIdMutation({
        fixedCacheKey: memberid,
    });
    const [showStat, setShowState] = useState(false);
    const dispatch = useTypedDispatch();
    const memberId = getMemberId();
    const data = useParams();
    const [userData, setUserData] = useState<getMemberByIdResponse>({} as getMemberByIdResponse);
    const [totalDaos, setTotalDaos] = useState<number>(0);
    const [subdomain, setSubdomain] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);
    const [count, setCount] = useState<number>(0);
    useEffect(() => {
        const fn = async () => {};
        fn();
    }, []);

    const AfterFetch = (res: any) => {
        console.log({ res });
        setSubdomain(res?.data?.member?.subdomain || null);
        setCode(res?.data?.member?.invite_code || null);
        setCount(res?.data?.member?.invite_count || 0);
        if (memberid === getMemberId()) {
            dispatch(
                changeProfilePicture({
                    profilePicture: res.data?.member?.profile_picture || '',
                })
            );
        }

        setUserData(res);
    };

    useEffect(() => {
        console.log(memberData);

        if (memberData) {
            AfterFetch(memberData);
        } else {
            fetchUserProfile({
                member: { type: 'member_id', value: memberid! },
            })
                .unwrap()
                .then((res) => {
                    AfterFetch(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [memberid]);

    const [getDao] = useLazyGetDaoQuery();
    const fetchDao = async () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;
        if (member_id) {
            try {
                const response = await getDao(member_id).unwrap();
                console.log('response:', response);
                const dao = response?.data?.length;
                setTotalDaos(dao! || 0);
            } catch (err) {
                console.error(err);
            }
        }
    };
    useEffect(() => {
        fetchDao();
    }, []);

    return (
        <div className={clsx(styles.root, showStat && styles.rootStat)} data-role="user-profile">
            <div className={styles.wrapper}>
                <div className={styles.info}>
                    <UserInfo userData={userData} />
                </div>
                <div className={styles.controls}>
                    <UserControls call feed subdomain={subdomain} code={code} count={count} />
                </div>
                <div className={styles.stat}>
                    <UserStat />
                </div>
                {/* <div style={{ color: 'white' }}>
          <div>Connections {'0'}</div>
          <div>Clans {'0'}</div>
          <div>DAO {totalDaos}</div>
        </div> */}
                {/* <div className="user-profile__extra">
          <UserExtra userData={userData} />
        </div> */}
                {/* <div className={styles.settings}>
          <UserSettings />
        </div> */}
                <button className={styles.toggleStatBtn} onClick={setShowState.bind(null, true)}>
                    <ArrowLeftIcon />
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
