import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import useInput from 'hooks/useInput';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import TeamMember from './TeamMember';
import styles from '../styles/TeamSidebar.module.scss';
import { TeamFilter } from './TeamFilter';
import { useGetContributorSkillsQuery } from 'store/services/Discovery/Discovery';
import { TeamMember as TeamMemberData } from '@samudai_xyz/gateway-consumer-types';

interface TeamSidebarProps {
    active: TeamMemberData;
    changeActiveUser: (u: TeamMemberData) => void;
    users: TeamMemberData[];
}

const TeamSidebar: React.FC<TeamSidebarProps> = ({ active, changeActiveUser, users }) => {
    const [search, setSearch] = useInput('');
    const [data, setdata] = useState<TeamMemberData[]>(users);
    const [showUsers, setShowUsers] = useState(true);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const { data: contributorSkillList } = useGetContributorSkillsQuery();

    const filteredData = useMemo(() => {
        if (!selectedSkills.length) {
            return data;
        }
        return data.filter((item) => item.skills?.some((skill) => selectedSkills.includes(skill)));
    }, [data, selectedSkills]);

    useEffect(() => {
        if (search === '') setdata(users);
        else {
            const result = users.filter(
                (u) => u?.name?.toLowerCase().includes(search.toLowerCase())
            );
            setdata(result);
        }
    }, [search, users]);

    useEffect(() => {
        setdata(users);
    }, []);

    return (
        <div
            className={clsx(styles.root, showUsers && styles.root_users)}
            data-role="sidebar"
            data-analytics-parent="team_members_sidebar"
        >
            <header className={styles.head}>
                <h3 className={styles.headTitle}>Team Members</h3>
                {/* <button className={styles.headMore} onClick={() => setShowUsers(!showUsers)}>
                    <ArrowLeftIcon />
                </button> */}
                <TeamFilter
                    onChange={(skills) => setSelectedSkills(skills)}
                    selected={selectedSkills}
                    departments={contributorSkillList?.data?.skills || []}
                />
            </header>
            <Input
                placeholder="Search Members"
                value={search}
                onChange={setSearch}
                className={styles.input}
                icon={<Magnifier className={styles.inputMagnifier} />}
                data-analytics-click="members_search_bar"
            />
            <ul className={styles.userList}>
                {filteredData.map((u) => (
                    <TeamMember
                        active={u.member_id === active.member_id}
                        onClick={() => changeActiveUser(u)}
                        data={u}
                        key={u.member_id}
                    />
                ))}
            </ul>
        </div>
    );
};

export default TeamSidebar;
