import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedSelector } from 'hooks/useStore';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';

export const useFetchActiveProjects = () => {
    const activeDAO = useTypedSelector(selectActiveDao);
    const { memberid } = useParams();
    const [getDao] = useLazyGetDaoQuery();
    const [userData, setUserData] = useState<any[]>([]);
    const [projects, setProjects] = useState<ProjectResponse[]>();

    useEffect(() => {
        const obj: any = [];
        getDao(memberid!)
            .unwrap()
            .then((res) => {
                res?.data?.forEach((val) => {
                    obj.push({
                        roles: val.roles.map((role: any) => role.role_id),
                        dao_id: val.dao_id,
                    });
                });
                setUserData(obj);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getDao, memberid]);

    const payload = {
        member_id: memberid!,
        daos: userData,
    };

    const [getProjects, { isLoading }] = useGetProjectByMemberIdMutation();

    const fetchProjects = async () => {
        getProjects(payload)
            .unwrap()
            .then((res) => setProjects(res?.data))
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (!projects) fetchProjects();
    }, [activeDAO, memberid, userData, projects]);

    return {
        data: projects?.filter((p) => p.completed === false) || [],
        isLoading,
    };
};
