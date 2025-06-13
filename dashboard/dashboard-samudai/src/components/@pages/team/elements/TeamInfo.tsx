import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TeamMemberResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import { selectActiveDao, selectRoles } from 'store/features/common/slice';
import { useLazyGetDaoMemberInfoQuery } from 'store/services/Dao/dao';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { returnData } from 'components/@pages/dashboard/ui/activity/logs/logs-merge';
import ProjectActive from 'components/project/elements/ProjectActive';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import SkillList from 'ui/SkillList/SkillList';
import { getMemberId } from 'utils/utils';
import TeamUpdate from './TeamUpdate';
import css from '../styles/TeamInfo.module.scss';

interface TeamInfoProps {
    user: TeamMemberResponse;
}

const TeamInfo: React.FC<TeamInfoProps> = ({ user }) => {
    const sliderSettings: SwiperProps = {
        slidesPerView: 1,
        allowTouchMove: false,
        modules: [Pagination, Navigation],
        navigation: {
            prevEl: '.' + css.projectPrev,
            nextEl: '.' + css.projectNext,
        },
        pagination: {
            clickable: true,
            el: '.' + css.projectPag,
            bulletClass: css.projectPagItem,
            bulletActiveClass: css.projectPagItemActive,
        },
    };
    const { daoid } = useParams();
    const [fetchMember, loading1] = useLazyGetDaoMemberInfoQuery();
    const [selectedMember, setSelectedMember] = useState({} as TeamMemberResponse);
    const roles = useTypedSelector(selectRoles);
    const activeDAO = useTypedSelector(selectActiveDao);
    const dispatch = useTypedDispatch();

    const payload = {
        member_id: getMemberId(),
        daos: [
            {
                dao_id: activeDAO,
                roles,
            },
        ],
    };

    const [getProjects, { data, isSuccess }] = useGetProjectByMemberIdMutation({
        fixedCacheKey: activeDAO,
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
        console.log('Dao Changed to', activeDAO);
    }, [activeDAO, roles]);

    useEffect(() => {
        const fn = async () => {
            const memberData: any = await fetchMember(
                {
                    daoId: daoid!,
                    memberId: user?.member?.member_id,
                },
                true
            ).unwrap();
            console.log('team memdata', memberData);
            setSelectedMember(memberData.data);
        };
        user?.member?.member_id && fn();
    }, [user?.member?.member_id, daoid]);

    return (
        <ul className={css.root}>
            {/* <li>
                <p className={css.departments}>
                    Department <span>Design</span>
                </p>
            </li> */}
            {/* Tasks */}
            <li className={css.tasks}>
                <div className={css.block}>
                    <h4 className={css.block_title} style={{ color: '#B2FFC3' }}>
                        Closed Tasks
                    </h4>
                    <p className={css.block_value}>{user?.closed_task || ''}</p>
                </div>
                <div className={css.block}>
                    <h4 className={css.block_title} style={{ color: '#FDC087' }}>
                        Open Tasks
                    </h4>
                    <p className={css.block_value}>{user?.open_task || ''}</p>
                </div>
            </li>

            {/* <li className={css.tasks}>
                <div className={css.chart}>
                    <div className={css.chart_col}>
                        <p className={css.chart_value}>16</p>
                        <h3 className={css.chart_title}>Closed Tasks</h3>
                    </div>
                    <div className={css.chart_graph}>
                        <TeamChart
                            data={[
                                { date: '2023-06-02T18:38:43.708Z', value: 1 },
                                { date: '2023-06-03T18:38:43.708Z', value: 4 },
                                { date: '2023-06-04T18:38:43.708Z', value: 2 },
                                { date: '2023-06-05T18:38:43.708Z', value: 6 },
                                { date: '2023-06-06T18:38:43.708Z', value: 3 },
                            ]}
                            color="#FFE78C"
                        />
                    </div>
                </div>

                <div className={css.chart}>
                    <div className={css.chart_col}>
                        <p className={css.chart_value}>10</p>
                        <h3 className={css.chart_title}>Open Tasks</h3>
                    </div>
                    <div className={css.chart_graph}>
                        <TeamChart
                            data={[
                                { date: '2023-06-02T18:38:43.708Z', value: 1 },
                                { date: '2023-06-03T18:38:43.708Z', value: 4 },
                                { date: '2023-06-04T18:38:43.708Z', value: 2 },
                                { date: '2023-06-05T18:38:43.708Z', value: 6 },
                                { date: '2023-06-06T18:38:43.708Z', value: 3 },
                            ]}
                            color="#B2FFC3"
                        />
                    </div>
                </div>
            </li> */}

            {/* <div className={styles1.root}>
        <ul className={styles1.list}>
          <li className={styles1.item} key={1}>
            <div className={styles1.itemWrapper}>
              <div className={styles1.itemContent}>
                <ChartIcons.FavoriteChart className={styles1.itemIcon} />
                <p className={styles1.itemInfo}>
                  <strong>{10}</strong>
                  <span>{10}</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div> */}
            {/* Projects */}
            <li className={css.projects}>
                <h3 className={css.title}>Active projects</h3>
                <div className={css.projectsSlider}>
                    <Swiper className={css.projectsSwiper} {...sliderSettings}>
                        {data?.data
                            ?.filter((project) => project.completed === false)
                            .map((project) => (
                                <SwiperSlide className={css.projectsSlide} key={project.project_id}>
                                    <ProjectActive project={project} />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                    <div className={css.projectControls}>
                        <NavButton className={clsx(css.projectPrev)} />
                        <div className={css.projectPag}></div>
                        <NavButton className={clsx(css.projectNext)} variant="next" />
                    </div>
                </div>
                {/* <div className={styles2.body}>
          <ul className={clsx(styles2.list, true && styles2.listRow)}>
            {data?.data
              ?.filter((project) => project.completed === false)
              .slice(0, 3)
              .map((project, id) => (
                <ProjectCard
                  className={styles2.card}
                  variant={'row'}
                  project={project}
                  key={id}
                  pinned={project?.pinned}
                  board
                />
              ))}
          </ul>
        </div> */}
            </li>
            {/* Skills */}
            <li className={css.skills}>
                <h3 className={css.title}>Skills</h3>
                {/* Start */}
                {/* {selectedMember.skills && selectedMember.skills.length > 0 ? (
          <SkillList
            className={css.skillsList}
            skills={selectedMember?.skills}
            hideCross
          />
        ) : (
          <p className={css.noInfo}>No skills.</p>
        )} */}
                {/* END */}
                <SkillList
                    className={css.skillsList}
                    skills={
                        selectedMember && selectedMember.skills && selectedMember.skills.length > 0
                            ? selectedMember.skills
                            : []
                    }
                    hideCross
                />
                {/* <SkillList className={css.skillsList} skills={[] || user.skills} /> */}
            </li>
            {/* Bounty */}
            {/* <li className={css.bounty}>
        <h3 className={clsx(css.title, css.titleBounty)}>
          Tips/Bounty <span data-orange>$154,00</span>
        </h3>
      </li> */}
            {/* Updates */}
            <li className={css.updates}>
                <h3 className={css.title}>Recent Activity</h3>
                <ul className={css.updatesList}>
                    {selectedMember &&
                    selectedMember.last_activity &&
                    selectedMember.last_activity.length > 0 ? (
                        <ul className={css.updatesList}>
                            {selectedMember?.last_activity?.map((item: any, id: number) => {
                                return (
                                    <TeamUpdate key={id}>
                                        {returnData(item, selectedMember?.member?.name || '')}
                                    </TeamUpdate>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className={css.noInfo}>No actions yet.</p>
                    )}
                </ul>

                {/* {selectedMember &&
        selectedMember.last_activity &&
        selectedMember.last_activity.length > 0 ? (
          <ul className={css.updatesList}>
            {selectedMember?.last_activity?.map((item: any, id: number) => {
              return (
                <TeamUpdate key={id}>
                  {returnData(item, selectedMember?.member?.name!)}
                </TeamUpdate>
              );
            })}
          </ul>
        ) : (
          <p className={css.noInfo}>No actions yet.</p>
        )} */}
            </li>
        </ul>
    );
};

export default TeamInfo;
