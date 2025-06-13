import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { selectRoles } from 'store/features/common/slice';
import {
    addProjects,
    projectDaoId,
    updateProjectDaoId,
} from 'store/features/projects/projectSlice';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';

export const useFetchProjects = () => {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const { daoid } = useParams();
    const roles = useTypedSelector(selectRoles);
    const currProjectDaoId = useTypedSelector(projectDaoId);
    const dispatch = useTypedDispatch();
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;

    const [getProjects, { isLoading }] = useGetProjectByMemberIdMutation({ fixedCacheKey: daoid });

    const fetchProjects = useCallback(async () => {
        const payload = {
            member_id: member_id,
            daos: [
                {
                    dao_id: daoid!,
                    roles,
                },
            ],
        };
        getProjects(payload)
            .unwrap()
            .then((res) => {
                console.log(res?.data);
                setProjects(res?.data.filter((val) => val.access !== 'hidden'));
                dispatch(addProjects(res?.data.filter((val) => val.access !== 'hidden')));
                daoid && dispatch(updateProjectDaoId(daoid));
            })
            .catch((err) => {
                console.error(err);
            });
    }, [daoid, roles]);

    useEffect(() => {
        if (daoid !== currProjectDaoId) {
            fetchProjects();
        }
    }, [daoid, currProjectDaoId]);

    return {
        projects,
        isLoading,
        fetchProjects,
    };
};
