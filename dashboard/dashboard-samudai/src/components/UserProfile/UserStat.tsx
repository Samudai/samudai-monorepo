import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { changeActiveDaoName, selectMemberConnections } from 'store/features/common/slice';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';
import { useLazyGetConnectionsByMemberIdQuery } from 'store/services/userProfile/userProfile';
import { useTypedSelector } from 'hooks/useStore';
import InformationIcon from 'ui/SVG/InformationIcon';
import PersonAddIcon from 'ui/SVG/PersonAddIcon';
import Hint from 'ui/hint/hint';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './styles/UserStat.module.scss';

interface UserStatProps {}

const images = [
    '/mockup/img/daos/logo-1.png',
    '/mockup/img/daos/logo-2.png',
    '/mockup/img/daos/logo-3.png',
    '/mockup/img/daos/logo-4.png',
    '/mockup/img/daos/logo-5.png',
];

const getInitial = (name: string) => {
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

const UserStat: React.FC<UserStatProps> = (props) => {
    const [getDao] = useLazyGetDaoQuery();
    const { memberid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [daos, setDaos] = useState<any[]>([]);
    const [getConnections] = useLazyGetConnectionsByMemberIdQuery();
    const sameMember = getMemberId() === memberid;
    const connections = useTypedSelector(selectMemberConnections);
    const [memberConnections, setMemberConnections] = useState<any>();

    const fetchDao = async () => {
        if (memberid) {
            try {
                const response = await getDao(memberid!).unwrap();
                console.log('response:', response);
                setDaos(response?.data || []);

                console.log('dao list', response);
            } catch (err: any) {
                toast(
                    'Failure',
                    5000,
                    'Something went wrong in fetching total DAOs',
                    err?.data?.message
                )();
            }
        }
    };
    useEffect(() => {
        fetchDao();
        if (!sameMember) {
            getConnections(memberid!, true)
                .unwrap()
                .then((res) => {
                    setMemberConnections(res.data);
                });
        }
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.blocks}>
                <div
                    className={styles.blocksItem}
                    style={{ cursor: sameMember ? 'pointer' : '' }}
                    onClick={() => (sameMember ? navigate(`/${memberid}/connections`) : {})}
                >
                    <div className={styles.blocksHead}>
                        <h4 className={styles.blocksTitle}>Connections</h4>
                        <PersonAddIcon className={styles.blocksIcon} data-green />
                    </div>
                    <div className={styles.blocksData}>
                        <p className={styles.blocksValue}>
                            {sameMember
                                ? connections?.total
                                    ? connections?.total
                                    : '0'
                                : memberConnections?.total
                                ? memberConnections?.total
                                : '0'}
                        </p>
                        {/* <p className={styles.blocksPercentage} data-green>
              +2%
            </p> */}
                    </div>
                </div>
                <div className={styles.blocksItem}>
                    <div className={styles.blocksHead}>
                        <h4 className={styles.blocksTitle}>Clans</h4>
                        <InformationIcon className={styles.blocksIcon} data-lavender />
                    </div>
                    <div className={styles.blocksData}>
                        <p
                            className={styles.blocksValue}
                            style={{ font: '600 17px/1 "Lato", sans-serif', marginTop: '5px' }}
                        >
                            Coming Soon..
                        </p>
                        {/* <p className={styles.blocksPercentage} data-lavender>
              +12%
            </p> */}
                    </div>
                </div>
            </div>
            {daos.length > 0 && (
                <div className={styles.daos}>
                    <h3 className={styles.daosTitle}>Dao</h3>
                    <div className={styles.daosGroup}>
                        <ul className={styles.daosList}>
                            {daos?.slice(0, 4).map((dao) => (
                                <li className={styles.daosItem} key={dao}>
                                    {dao?.profile_picture ? (
                                        <Hint text={dao?.name}>
                                            <div>
                                                <img
                                                    src={
                                                        dao?.profile_picture ||
                                                        '/mockup/img/daos/logo-1.png'
                                                    }
                                                    alt="dao-logo"
                                                    className="img-cover"
                                                    onClick={() => {
                                                        dispatch(
                                                            changeActiveDaoName({
                                                                activeDaoName: dao?.name,
                                                            })
                                                        );
                                                        navigate(`/${dao?.dao_id}/dashboard/1`);
                                                    }}
                                                />
                                            </div>
                                        </Hint>
                                    ) : (
                                        <Hint text={dao?.name}>
                                            <div
                                                className="sidebar-dao__btn-icon"
                                                onClick={() => {
                                                    dispatch(
                                                        changeActiveDaoName({
                                                            activeDaoName: dao?.name,
                                                        })
                                                    );
                                                    navigate(`/${dao?.dao_id}/dashboard/1`);
                                                }}
                                            >
                                                {/* <div className={styles.buttonIcon}> */}
                                                {dao.profilePicture ? (
                                                    <img src={dao.profilePicture} alt="" />
                                                ) : (
                                                    // initial
                                                    <span className={styles.daoBtnName}>
                                                        {getInitial(dao.name)}
                                                    </span>
                                                )}
                                                {/* </div> */}
                                            </div>
                                        </Hint>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {daos?.length > 4 && (
                            <div className={styles.daosMore}>{`+${daos.length - 4}`}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserStat;
