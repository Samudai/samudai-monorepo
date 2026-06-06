import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TeamMember, TeamMemberResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useLazyGetDaoMemberInfoQuery, useLazyGetDaoMembersQuery } from 'store/services/Dao/dao';
import { useScrollbar } from 'hooks/useScrollbar';
import TeamInfo from 'components/@pages/team/elements/TeamInfo';
import TeamSidebar from 'components/@pages/team/elements/TeamSidebar';
import TeamUser from 'components/@pages/team/elements/TeamUser';
import Loader from 'components/Loader/Loader';
import styles from './team.module.scss';

const Team: React.FC = () => {
    const [candidatActive, setCandidatActive] = useState({} as TeamMember); // On change
    const [selectedMember, setSelectedMember] = useState({} as TeamMemberResponse); // On click
    const [taskCount, setTaskCount] = useState(0); // On change
    // const [candidats, setCandidats] = useState<Member[]>(mockup_users); // Fetch user + statistic
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>(true); // For margin
    const [isLoading, setLoading] = useState(false);

    const [memberData, setMemberData] = useState<TeamMember[]>([]);
    const [fetchMember, loading1] = useLazyGetDaoMemberInfoQuery();
    const [fetchTeamData, loading] = useLazyGetDaoMembersQuery();
    const { daoid } = useParams();

    const handleChangeActiveUser = async (u: TeamMember) => {
        setCandidatActive(u);
        setLoading(true);
        const memberData: any = await fetchMember({
            daoId: daoid!,
            memberId: u.member_id,
        }).unwrap();
        setSelectedMember(memberData.data);
        setLoading(false);
    };

    useEffect(() => {
        const fn = async () => {
            setLoading(true);
            const teamData: any = await fetchTeamData(daoid!).unwrap();
            console.log('team', teamData.data);
            const member_id = teamData.data[0].member_id;
            const memberData: any = await fetchMember({
                daoId: daoid!,
                memberId: member_id,
            }).unwrap();
            // console.log('team memdata', teamData.data);
            setSelectedMember(memberData.data);
            setCandidatActive(teamData?.data?.[0]);
            setMemberData(teamData?.data || []);
            setLoading(false);
        };
        fn();
    }, [daoid]);

    return (
        <div
            className={clsx(styles.root, isScrollbar && styles.rootScrollbar)}
            ref={ref}
            data-analytics-page="dao_team"
        >
            <div
                className={clsx('container', styles.container)}
                data-analytics-parent="dao_team_parent_container"
            >
                <div className={styles.sidebar}>
                    <TeamSidebar
                        active={candidatActive}
                        changeActiveUser={handleChangeActiveUser}
                        users={memberData}
                    />
                </div>
                <div className={styles.content}>
                    <div className={styles.teamInfo}>
                        {!isLoading ? (
                            [TeamUser, TeamInfo].map((Component) => (
                                <Component user={selectedMember} key={Component.name} />
                            ))
                        ) : (
                            <div className={styles.loader}>
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
