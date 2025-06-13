import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { selectActiveDao, selectRoles } from 'store/features/common/slice';
import { addProjects } from 'store/features/projects/projectSlice';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import '../../styles/Projects.scss';
import { ProjectsItem, ProjectsSkeleton } from '../../ui/projects/components';

enum ProjectStatuses {
    Progress = 'progress',
    Completed = 'completed',
}

const Projects: React.FC = () => {
    // const { data, isLoading } = useTypedSelector(selectProjects);
    const [type, setType] = useState<ProjectStatuses>(ProjectStatuses.Progress);

    const media = { '< 400': 'small' };

    const isCompleted = ProjectStatuses.Completed === type;
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const roles = useTypedSelector(selectRoles);
    const dispatch = useTypedDispatch();
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    const [getProjects, { data, isSuccess, isLoading }] = useGetProjectByMemberIdMutation({
        fixedCacheKey: daoid,
    });
    const navigate = useNavigate();
    const items = data?.data?.filter((p) => p.completed === isCompleted);

    const afterFetch = async (res: any) => {
        try {
            dispatch(addProjects(res?.data));
        } catch (err) {
            console.log(err);
        }
    };

    const payload = {
        member_id: member_id,
        daos: [
            {
                dao_id: daoid!,
                roles,
            },
        ],
    };
    const fetchProjects = async () => {
        if (data) {
            afterFetch(data);
        } else {
            getProjects(payload)
                .unwrap()
                .then((res) => {
                    afterFetch(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [daoid!]);

    return (
        <Block media={media} className="projects" data-analytics-parent="projects_widget">
            <Block.Header>
                <Block.Title>Projects</Block.Title>
                <Block.Link onClick={() => navigate(`/${daoid}/projects`)} />
            </Block.Header>
            <div className="projects__tabs">
                <button
                    className={clsx('projects__tabs-btn', {
                        active: type === ProjectStatuses.Progress,
                    })}
                    disabled={isLoading && type !== ProjectStatuses.Progress}
                    onClick={setType.bind(null, ProjectStatuses.Progress)}
                    data-analytics-click="on_progress_button"
                >
                    In Progress
                </button>
                <button
                    className={clsx('projects__tabs-btn', {
                        active: type === ProjectStatuses.Completed,
                    })}
                    disabled={isLoading && type !== ProjectStatuses.Completed}
                    onClick={setType.bind(null, ProjectStatuses.Completed)}
                    data-analytics-click="completed_button"
                >
                    Upcoming
                </button>
            </div>
            <Block.Scrollable>
                <Skeleton
                    className="projects__list"
                    component="ul"
                    loading={isLoading}
                    skeleton={<ProjectsSkeleton />}
                    afterStart={
                        <>
                            <li className="projects-item projects-item_title">
                                <div className="projects-item__col projects-item__col_name">
                                    <h5 className="projects-item__title">Project Name</h5>
                                </div>
                                <div className="projects-item__col projects-item__col_start-date">
                                    <h5 className="projects-item__title">Start Date</h5>
                                </div>
                                <div className="projects-item__col projects-item__col_end-date">
                                    <h5 className="projects-item__title">End Date</h5>
                                </div>
                                <div className="projects-item__col projects-item__col_progress">
                                    <h5 className="projects-item__title">Project Progress</h5>
                                </div>
                            </li>
                        </>
                    }
                >
                    {(items || [])?.length > 0 ? (
                        items
                            ?.filter((item) => item.project_type !== 'investment')
                            ?.slice(0, 5)
                            .map((project) => (
                                <ProjectsItem key={project.project_id} project={project} />
                            ))
                    ) : (
                        <div style={{ textAlign: 'center', color: '#dedede', margin: '20px 0px' }}>
                            No Projects to display
                        </div>
                    )}
                </Skeleton>

                {/* <div className="pr-empty">
                    <p className="pr-empty__text">
                        <span>You have no recent projects.</span>
                        <span>Create a new project.</span>
                    </p>

                    <Button 
                        className="pr-empty__createBtn"
                        color="orange-outlined"
                    >
                        <span>Create a Project</span>
                    </Button>
                </div> */}
            </Block.Scrollable>
        </Block>
    );
};

export default Projects;
