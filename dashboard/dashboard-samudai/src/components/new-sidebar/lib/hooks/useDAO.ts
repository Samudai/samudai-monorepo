import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DAOType } from 'root/mockup/daos';
import {
    changeAccess,
    changeAccessList,
    changeActiveDao,
    changeActiveDaoName,
    changeDaoList,
    changeGcal,
    changeGuildId,
    changeRoles,
    changeSnapshot,
    changeTokenGating,
    selectAccess,
    selectActiveDaoName,
    selectDaoList,
    selectUrl,
} from 'store/features/common/slice';
import { useLazyGetDaoByDaoIdQuery, useLazyGetDaoQuery } from 'store/services/Dao/dao';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { getArrayFromObject } from 'utils/arrayHelperFunctions';
import checkIfValidUUID from 'utils/checkIfValidUUID';
import { getMemberId, getTrailDaoId } from 'utils/utils';
import { getInitial } from '../getInitial';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { addedDao, changeAddedDao } from 'store/features/common/slice';

export const useDAO = (callback?: () => void) => {
    const dispatch = useTypedDispatch();
    const loadUrl = useTypedSelector(selectUrl);
    const activeDaoName = useTypedSelector(selectActiveDaoName);
    const { daoid } = useParams();
    const navigate = useNavigate();
    const trialDashboard = useTypedSelector(selectTrialDashboard);
    const daoList = useTypedSelector(selectDaoList);
    const accessDao = useTypedSelector(selectAccess);
    const isAdddedDAO = useTypedSelector(addedDao);

    const [getDao] = useLazyGetDaoQuery();
    const [getTrialDao] = useLazyGetDaoByDaoIdQuery();
    const [activeDAO, setActiveDAO] = useState<DAOType>({
        id: '',
        name: '',
        token_gating: true,
        guildId: '',
    });

    const [initial, setInitial] = useState<string>('');
    const [DAOList, setDAOList] = useState<DAOType[]>([]);

    useEffect(() => {
        dispatch(changeDaoList({ list: DAOList }));
    }, [DAOList]);

    const routesFun = (bool?: true) => {
        const path = window.location.pathname.split('/');
        if (!!path[1] && checkIfValidUUID(path[1])) {
            if (!!path[2] && path[2] === 'profile') {
                navigate(`/${path[1]}/profile`);
            } else if (!!path[2] && path[2] === 'connections') {
                const newPath = path.join('/');
                navigate(newPath);
            } else {
                path[1] = bool ? activeDAO.id : daoid!;
                let newPath: string;
                if (path[2] === 'dashboard') newPath = path.slice(0, 4).join('/');
                else if (path[2] === 'settings') {
                    if (
                        path[3] === 'dao' &&
                        !!activeDAO.id &&
                        accessDao?.includes(AccessEnums.AccessType.MANAGE_DAO)
                    ) {
                        path[1] = activeDAO.id;
                        path[3] = 'dao';
                        newPath = path.slice(0, 4).join('/');
                    } else {
                        path[1] = getMemberId();
                        path[3] = 'contributor';
                        newPath = path.slice(0, 4).join('/');
                    }
                } else if (path[2] === 'projects') {
                    if (activeDAO.id === daoid) newPath = path.slice(0, 8).join('/');
                    else newPath = path.slice(0, 3).join('/');
                } else newPath = path.join('/');
                // else newPath = path.slice(0, 3).join('/');
                navigate(`${newPath}`);
            }
        } else {
            if (!!path[1] && path[1] === 'jobs') {
                const newPath = path.join('/');
                navigate(newPath);
            } else if (!!path[1] && path[1] === 'discovery') {
                const newPath = path.join('/');
                navigate(newPath);
            } else if (path[1] === 'messages') {
                navigate(`/messages`);
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
        if (member_id) {
            try {
                const response = await getDao(member_id).unwrap();
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
                response?.data?.[0].token_gating &&
                    dispatch(changeTokenGating({ token_gating: response.data[0].token_gating }));
                setDAOList(dao! || []);
                setActiveDAO(dao?.find((val) => val.id === daoid) || dao![0] || ({} as DAOType));
                if (dao![0].id) {
                    if (loadUrl) {
                        if (
                            loadUrl === '/' ||
                            loadUrl === '/signup' ||
                            loadUrl === '/check' ||
                            loadUrl === '/login'
                        )
                            navigate(`/${dao![0].id}/dashboard/1`);
                        loadUrl !== ('/check' || '/' || '/signup' || '/jobs' || '/login')
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
        if (member_id) {
            try {
                const response = await getDao(member_id).unwrap();
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

    const fetchTrialDao = async () => {
        const trialDao = getTrailDaoId();
        localStorage.setItem('daoid', trialDao);
        try {
            const response = await getTrialDao(trialDao).unwrap();
            if (response.data?.dao) {
                const dao = response.data.dao;
                dispatch(
                    changeAccessList({ accessList: { trialDao: [AccessEnums.AccessType.VIEW] } })
                );
                dispatch(changeActiveDao({ activeDao: dao.dao_id }));
                dispatch(changeActiveDaoName({ activeDaoName: dao.name }));
                setInitial(getInitial(dao.name));
                dispatch(changeTokenGating({ token_gating: false }));
                dispatch(changeGuildId({ guildId: dao.guild_id }));

                const daoDetails = {
                    id: dao.dao_id,
                    name: dao.name,
                    token_gating: false,
                    guildId: dao.guild_id,
                };
                setDAOList([daoDetails]);
                setActiveDAO(daoDetails);
                navigate(`/${dao.dao_id}/dashboard/1`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDao();
    }, []);

    useEffect(() => {
        !!daoid && !DAOList.find((val) => val.id === daoid!) && fetchDao1();
    }, [daoid]);

    useEffect(() => {
        if (isAdddedDAO) {
            fetchDao1();
            dispatch(changeAddedDao({ addedDao: false }));
        }
    }, [isAdddedDAO]);

    useEffect(() => {
        if (trialDashboard) {
            fetchTrialDao();
        }
    }, [trialDashboard]);

    useEffect(() => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;
        if (trialDashboard) return;
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
                res?.data?.[0]?.dao_id &&
                    dispatch(
                        changeActiveDao({
                            activeDao: '' + activeDAO.id || res.data[0].dao_id,
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

        if (activeDAO.id) routesFun(true);
    }, [activeDAO.id, activeDAO]);

    const handleChangeDao = (dao: DAOType) => {
        if (dao.id !== activeDAO.id) {
            setActiveDAO(dao);
            setInitial(getInitial(dao.name));
            callback?.();
        }
    };

    const handleAddDao = () => {
        dispatch(changeGcal({ gcal: false }));
        dispatch(changeSnapshot({ snapshot: false }));
        localStorage.removeItem('daoId');
        localStorage.removeItem('google calendar');
        localStorage.removeItem('gcal');
        // localStorage.setItem('account_type', 'admin');
        navigate('/adddao');
        callback?.();
    };

    return {
        DAOList,
        activeDAO,
        handleChangeDao,
        handleAddDao,
    };
};
