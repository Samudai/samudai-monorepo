import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { DAOType, mockup_daos } from 'root/mockup/daos';
import { replaceParam } from 'root/router/utils';
import {
    changeAccess,
    changeAccessList,
    changeActiveDao,
    changeActiveDaoName,
    changeGcal,
    changeGuildId,
    changeRoles,
    changeSnapshot,
    changeTokenGating,
    selectActiveDao,
    selectActiveDaoName,
    selectUrl,
} from 'store/features/common/slice';
import { daoApi, useLazyGetDaoQuery } from 'store/services/Dao/dao';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Select from 'ui/@form/Select/Select';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import { getArrayFromObject, getRoles } from 'utils/arrayHelperFunctions';
import checkIfValidUUID from 'utils/checkIfValidUUID';
import { getMemberId } from 'utils/utils';
import styles from '../styles/SidebarDao.module.scss';

const SidebarDao: React.FC<{ mini?: boolean }> = ({ mini }) => {
    const dispatch = useTypedDispatch();
    const loadUrl = useTypedSelector(selectUrl);

    const [activeSelect, setActiveSelect] = useState<boolean>(false);
    const [initial, setInitial] = useState<string>('');
    const [DAOList, setDAOList] = useState<DAOType[]>([
        { id: '', name: '', token_gating: true, guildId: '' },
    ]);
    const [activeDAO, setActiveDAO] = useState<DAOType>({
        id: '',
        name: '',
        token_gating: true,
        guildId: '',
    });
    const currentDao = useTypedSelector(selectActiveDao);
    const activeDaoName = useTypedSelector(selectActiveDaoName);
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { daoid } = useParams();
    const navigate = useNavigate();

    const [getDao] = useLazyGetDaoQuery();

    const routesFun = (bool?: true) => {
        const path = window.location.pathname.split('/');
        if (!!path[1] && checkIfValidUUID(path[1])) {
            if (!!path[2] && path[2] === 'profile') {
                navigate(`/${path[1]}/profile`);
            } else {
                path[1] = bool ? activeDAO.id : daoid!;
                let newPath: string;
                if (path[2] === 'dashboard') newPath = path.slice(0, 4).join('/');
                else if (path[2] === 'settings') newPath = path.slice(0, 6).join('/');
                else if (path[2] === 'projects') newPath = path.slice(0, 8).join('/');
                else newPath = path.slice(0, 3).join('/');
                // const newPath = path.join('/');
                navigate(`${newPath}`);
            }
        } else {
            if (!!path[1] && path[1] === 'jobs') {
                navigate(`/jobs`);
            } else if (path[1] === 'dashboard' && DAOList.length > 0) {
                navigate(`/${activeDAO.id}/dashboard/1`);
            } else {
                navigate('/dashboard/1');
            }
        }
    };

    const fetchDao = async () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;
        if (!!member_id) {
            try {
                const response = await getDao(member_id).unwrap();
                console.log('response:', response);
                const obj: any = {};
                response?.data?.forEach((val) => {
                    obj[val.dao_id] = val.access;
                });
                dispatch(changeAccessList({ accessList: obj }));
                const dao = response?.data?.map((val) => {
                    return {
                        id: val.dao_id,
                        name: val.name,
                        profilePicture: val.profile_picture,
                        token_gating: val.token_gating,
                        guildId: val.guild_id,
                    } as DAOType;
                });
                dispatch(
                    changeActiveDao({
                        activeDao: '' + activeDAO.id || dao![0]?.id,
                    })
                );
                dispatch(
                    changeActiveDaoName({
                        activeDaoName: activeDAO.name,
                    })
                );
                dispatch(
                    changeGuildId({
                        guildId: activeDAO.guildId,
                    })
                );
                setInitial(getInitial(activeDaoName));
                dispatch(changeTokenGating({ token_gating: response?.data?.[0].token_gating! }));
                setDAOList(dao! || []);
                setActiveDAO(dao?.find((val) => val.id === daoid) || dao![0] || ({} as DAOType));
                if (!!dao![0].id) {
                    if (!!loadUrl) {
                        if (loadUrl === '/' || '/signup' || '/check')
                            navigate(`/${dao![0].id}/dashboard/1`);
                        loadUrl !== ('/check' || '/' || '/signup' || '/jobs')
                            ? navigate(loadUrl)
                            : navigate(`/${dao![0].id}/dashboard/1`);
                    }
                }
                // else navigate(`/dashboard/1`);
            } catch (err) {
                console.error(err);
            }
        }
    };
    const fetchDao1 = async () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;
        if (!!member_id) {
            try {
                const response = await getDao(member_id).unwrap();
                console.log('response:', response);
                const obj: any = {};
                response?.data?.forEach((val) => {
                    obj[val.dao_id] = val.access;
                });
                dispatch(changeAccessList({ accessList: obj }));
                const dao = response?.data?.map((val) => {
                    return {
                        id: val.dao_id,
                        name: val.name,
                        profilePicture: val.profile_picture,
                        token_gating: val.token_gating,
                        guildId: val.guild_id,
                    } as DAOType;
                });

                setDAOList(dao! || []);
                // setActiveDAO(dao?.find((val) => val.id === daoid) || dao![0] || ({} as DAOType));
                // else navigate(`/dashboard/1`);
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchDao();
    }, []);

    useEffect(() => {
        !!daoid && !DAOList.find((val) => val.id === daoid!) && fetchDao1();
    }, [daoid]);

    useEffect(() => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;
        getDao(member_id)
            .unwrap()
            .then((res) => {
                if (res?.data?.length === 0 || !res?.data) navigate(`/${getMemberId()}/profile/`);
                const roles = getArrayFromObject(res?.data, activeDAO.id, 'role_id');
                const access = res?.data?.find((val) => val.dao_id === activeDAO.id)?.access;
                dispatch(changeAccess({ access: access! }));
                dispatch(
                    changeRoles({
                        roles: roles,
                    })
                );
                dispatch(
                    changeActiveDao({
                        activeDao: '' + activeDAO.id || res?.data?.[0]?.dao_id!,
                    })
                );
                dispatch(
                    changeActiveDaoName({
                        activeDaoName: activeDAO.name,
                    })
                );
                dispatch(
                    changeGuildId({
                        guildId: activeDAO.guildId,
                    })
                );
                dispatch(
                    changeTokenGating({
                        token_gating: activeDAO.token_gating,
                    })
                );
            });

        dispatch(changeTokenGating({ token_gating: activeDAO.token_gating }));
        setInitial(getInitial(activeDaoName));

        if (!!activeDAO.id) routesFun(true);
    }, [activeDAO.id, activeDAO]);

    const handleToggleSelect = () => {
        setActiveSelect(!activeSelect);
    };

    const handleClickOut = (e: MouseEvent) => {
        if (buttonRef.current && !e.composedPath().includes(buttonRef.current)) {
            setActiveSelect(false);
        }
    };

    const handleChangeDao = (dao: DAOType) => {
        if (dao.id !== activeDAO.id) {
            setActiveDAO(dao);
            setInitial(getInitial(dao.name));
            setActiveSelect(false);
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
            className={clsx(styles.root, {
                [styles.active]: activeSelect,
                [styles.mini]: mini,
            })}
        >
            <button className={styles.button} ref={buttonRef} onClick={handleToggleSelect}>
                <div className={styles.buttonIcon}>
                    {!!activeDAO.profilePicture ? (
                        <img src={activeDAO.profilePicture} alt="" />
                    ) : (
                        // initial
                        getInitial(activeDaoName)
                    )}
                </div>

                <p className={styles.buttonName}>{activeDaoName}</p>
                <div className={styles.buttonArrow}>
                    <ArrowLeftIcon />
                </div>
            </button>
            <Select.List
                className={styles.select}
                active={activeSelect}
                onClickOutside={handleClickOut}
                maxShow={4}
            >
                {DAOList.filter((val) => val.id !== activeDAO.id).map((dao) => (
                    <Select.Item
                        className={clsx(styles.selectItem, {
                            active: dao.id === activeDAO.id,
                        })}
                        key={dao.id}
                        onClick={() => handleChangeDao(dao)}
                    >
                        <div className={styles.buttonIcon}>
                            {!!dao.profilePicture ? (
                                <img src={dao.profilePicture} alt="" />
                            ) : (
                                // initial
                                getInitial(dao.name)
                            )}
                        </div>
                        <p className={styles.buttonName}>{dao.name}</p>
                    </Select.Item>
                ))}
                <Select.After className={styles.selectAfter}>
                    <button
                        className={styles.addDaoBtn}
                        onClick={() => {
                            dispatch(changeGcal({ gcal: false }));
                            dispatch(changeSnapshot({ snapshot: false }));
                            localStorage.removeItem('daoId');
                            localStorage.removeItem('google calendar');
                            localStorage.removeItem('gcal');
                            // localStorage.setItem('account_type', 'admin');
                            navigate('/adddao');
                        }}
                    >
                        <span className={styles.addDaoBtnIcon}>
                            <PlusIcon />
                        </span>
                        <span className={styles.addDaoBtnText}>Add New DAO</span>
                    </button>
                    <div className={styles.arrowMobile} onClick={handleToggleSelect}>
                        <ArrowLeftIcon />
                    </div>
                </Select.After>
            </Select.List>
        </div>
    );
};

export default SidebarDao;
