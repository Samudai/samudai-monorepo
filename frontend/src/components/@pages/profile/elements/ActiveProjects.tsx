import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { selectActiveDao, selectRoles } from 'store/features/common/slice';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import { ProjectList } from 'components/project';
import '../styles/ActiveProjects.scss';

const ActiveProjects: React.FC = () => {
    const activeDAO = useTypedSelector(selectActiveDao);
    const roles = useTypedSelector(selectRoles);
    const dispatch = useTypedDispatch();
    const { memberid } = useParams();
    const [getDao] = useLazyGetDaoQuery();
    const [userData, setUserData] = useState<any[]>([]);

    useEffect(() => {
        console.log('memberid', memberid);
        const obj: any = [];
        getDao(memberid!)
            .unwrap()
            .then((res) => {
                console.log('res', { res });
                res?.data?.forEach((val) => {
                    obj.push({
                        roles: val.roles.map((role: any) => role.role_id),
                        dao_id: val.dao_id,
                    });
                });
                setUserData(obj);
                console.log({ obj });
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getDao, memberid]);

    const payload = {
        member_id: memberid!,
        daos: userData,
    };
    const [getProjects, { data, isSuccess }] = useGetProjectByMemberIdMutation({
        fixedCacheKey: memberid,
    });

    const fetchProjects = async () => {
        getProjects(payload)
            .unwrap()
            .then((res) => {})
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        // fetchProjects();
        if (!data) {
            fetchProjects();
        }
    }, [activeDAO, memberid, userData]);

    return (
        <Block className="active-projects">
            <Block.Header>
                <Block.Title>Active Projects</Block.Title>
            </Block.Header>
            <Block.Scrollable className="active-projects__scrollable">
                {!!data && data?.data?.length > 0 ? (
                    <ProjectList
                        className="active-projects__projects"
                        projects={
                            data ? data?.data?.filter((project) => project.completed === false) : []
                        }
                    />
                ) : (
                    <div
                        className="transactions__header"
                        style={{
                            marginTop: '20px',
                            color: '#fdc087',
                            padding: '90px 0',
                            textAlign: 'center',
                        }}
                    >
                        No Active Projects
                    </div>
                )}
            </Block.Scrollable>
        </Block>
    );
};

export default ActiveProjects;
