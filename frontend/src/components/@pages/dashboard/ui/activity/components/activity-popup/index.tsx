import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityLogs } from '../activity-logs';
import clsx from 'clsx';
import { selectActiveDao, selectRoles } from 'store/features/common/slice';
import { useLazyGetProjectActivityQuery } from 'store/services/Dashboard/dashboard';
import { activityResponse } from 'store/services/Dashboard/model';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import Loader from 'components/Loader/Loader';
import BookIcon from 'ui/SVG/BookIcon';
import styles from './activity-popup.module.scss';

interface ActivityPopupProps {
    projectsData: any;
    activityData: activityResponse;
    onClose?: () => void;
}

// {
//   id: string;
//   icon: string;
//   title: string;
//   start_date: string;
//   end_date: string;
//   is_complete: boolean;
//   department: string;
//   visibility: ProjectVisibilty;
//   dao_id: string;
//   tasks: ITask[];
//   manager: IUser;
//   created_at: string;
//   updated_at: string;
// }

export const ActivityPopup: React.FC<ActivityPopupProps> = ({
    projectsData,
    activityData,
    onClose,
}) => {
    const [projects, setProjects] = useState<any[]>([]);
    const [active, setActive] = useState<any | null>(null);
    const [load, setLoad] = useState(false);
    const [getProjects, { data, isSuccess }] = useGetProjectByMemberIdMutation();
    const [activity, setActivity] = useState<any>();
    const [getPActivity] = useLazyGetProjectActivityQuery();
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const roles = useTypedSelector(selectRoles);
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;

    const payload = {
        member_id: member_id,
        daos: [
            {
                dao_id: activeDAO,
                roles,
            },
        ],
    };

    useEffect(() => {
        (async () => {
            try {
                setLoad(false);
                // const data = await ProjectApi.getAll();
                // setProjects(data);
                // setActive(data[0]);
                console.log('activity projects', projectsData);
                console.log('activity', activityData);
                // const projects = await getProjects(payload).unwrap();
                // console.log('projectsData', projects);
                // const data = projects.data.map((item) => {
                //   return item;
                // });
                setProjects(projectsData);
                if (projectsData![0].project_name === 'All Activity') {
                    setActive(projectsData![0]);
                    setActivity(activityData.data);
                    setLoad(true);
                } else if (projectsData[0]?.project_id) {
                    const projectActivity = await getPActivity(projectsData[0].project_id).unwrap();
                    console.log('projectActivity', projectActivity);
                    setActive(projectsData![0]);
                    setActivity(projectActivity.data);
                    setLoad(true);
                }
            } catch (e) {
                setLoad(true);
                console.log(e);
            }
        })();
    }, []);

    useEffect(() => {
        const fn = async () => {
            try {
                // setLoad(false);
                if (active.project_name === 'All Activity') {
                    setActivity(activityData.data);
                } else {
                    const projectActivity: activityResponse = await getPActivity(
                        active!.project_id!
                    ).unwrap();
                    console.log('projectActivity', projectActivity);
                    setActivity(projectActivity.data);
                }
                // setLoad(true);
            } catch (e) {
                // setLoad(true);
                console.error(e);
            }
        };
        fn();
    }, [active]);

    return (
        <Popup className={styles.root} onClose={onClose} dataParentId="recent_activity_modal">
            <header className={styles.head}>
                <h2 className={styles.headTitle}>Recent Activity</h2>
            </header>
            {load && active && (
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        <div className={styles.info}>
                            {/* <ProjectCard project={active} className={styles.infoCard} />
              <div className={styles.infoBlock}>
                <div className={styles.infoBlockInner}>
                  <h4 className={styles.suptitle}>Team Members</h4>
                  <Members
                    // users={ProjectHelper.getContributorsAll(active).map((u) => u.avatar)}
                    className={styles.members}
                  />
                  <h4 className={styles.suptitle}>Project Progress</h4>
                  <Progress
                    // percent={ProjectHelper.getStatistics(active).progress}
                    className={styles.progress}
                  />
                </div>
              </div> */}
                        </div>
                        <ActivityLogs activity={activity} />
                    </div>
                    <div className={styles.sidebar}>
                        <h3 className={styles.sidebarTitle}>Projects</h3>
                        <ul className={styles.sidebarList}>
                            {projects.map((project: any) => (
                                <li
                                    onClick={() => setActive(project)}
                                    className={clsx(
                                        styles.sidebarItem,
                                        active.project_id === project.project_id &&
                                            styles.sidebarItemActive
                                    )}
                                    key={project.project_id}
                                >
                                    <BookIcon className={styles.sidebarItemIcon} />
                                    <p className={styles.sidebarItemName}>{project.project_name}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {!load && <Loader />}
        </Popup>
    );
};
