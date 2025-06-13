import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectActiveDao, selectRoles } from 'store/features/common/slice';
import { addProjects } from 'store/features/projects/projectSlice';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Calendar from 'components/@pages/totalProjects/elements/Calendar';
import Progress from 'components/@pages/totalProjects/elements/Progress';
import Projects from 'components/@pages/totalProjects/elements/Projects';
import Loader from 'components/Loader/Loader';
import Breadcrumbs from 'components/breadcrumbs';
import RouteHeader from 'ui/RouteHeader/RouteHeader';
import Head from 'ui/head';
import { ProjectApi } from 'utils/api/project';
import { ProjectHelper } from 'utils/helpers/ProjectHelper';
import { IProject } from 'utils/types/Project';
import styles from './projects.module.scss';


const TotalProjects = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [projects1, setProjects1] = useState<ProjectResponse[]>([]);
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const roles = useTypedSelector(selectRoles);
    const dispatch = useTypedDispatch();
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    const location = useLocation();

    const [getProjects, { data: getProjectsData, isSuccess, isLoading }] =
        useGetProjectByMemberIdMutation();
    // if (isSuccess && getProjectsData) {
    //   setProjects(getProjectsData.data);
    //   addProjects(getProjectsData.data);
    // }

    const fetchProjects = async () => {
        try {
            const data = await ProjectApi.getAll();
            setProjects(data);
        } catch (e) {
            console.log(e);
        }
    };
    const fetchProjects1 = useCallback(async () => {
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
                setProjects1(res?.data.filter((val) => val.access !== 'hidden'));
                dispatch(addProjects(res?.data.filter((val) => val.access !== 'hidden')));
            })
            .catch((err) => {
                console.error(err);
            });
    }, [daoid, roles]);

    // useEffect(() => {
    //   fetchProjects();
    // }, []);

    useEffect(() => {
        // fetchProjects();
        activeDAO && fetchProjects1();
        console.log('Dao Changed to', daoid);
    }, [daoid, activeDAO]);

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <Head
                            breadcrumbs={[
                                { name: 'Workspace' },
                                { name: 'Projects', href: location.pathname },
                            ]}
                        >
                            <div className={styles.root_head}>
                                <Head.Title title="Projects Summary" />
                            </div>
                        </Head>
                        <div className={clsx('container', styles.container)}>
                            {/* <Breadcrumbs
                                links={[
                                    { name: 'Workspace' },
                                    { name: 'Projects', href: location.pathname },
                                ]}
                            />
                            <RouteHeader
                                title={
                                    projects1.filter((val) => val.access !== 'hidden').length +
                                    ' Total Projects'
                                }
                            >
                                {/* <div className={styles.rate}>
                <p className={styles.rateName}>On time completed rate</p>
                <p className={styles.rateValue}>90%</p>
                <div className={styles.rateStats}>
                  <ChartIcons.Increase />
                  <span>3.1%</span>
                </div>
              </div> 
                            </RouteHeader> */}
                            <Progress
                                statistic={ProjectHelper.countStatusAll(projects)}
                                projects={projects1}
                            />
                            <Projects projects={projects1} fetch1={fetchProjects1} />
                            <Calendar projects={projects1} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TotalProjects;