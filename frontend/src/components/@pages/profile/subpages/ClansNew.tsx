import React, { useState } from 'react';
import {
    ClanApplications,
    ClanBadges,
    ClanBounty,
    ClanMembers,
    ClanReviews,
    ClanSkills,
} from '../elements/clan';
import { members } from 'root/members';
import { clansMockup, mockup_clans } from 'root/mockup/clans';
import useInput from 'hooks/useInput';
import { HatButton, HatInfo } from 'components/chat/elements/Components';
import Hat from 'components/chat/elements/Hat';
import Settings from 'components/chat/elements/Settings';
import { ProjectList } from 'components/project';
import Input from 'ui/@form/Input/Input';
import ChatIcon from 'ui/SVG/ChatIcon';
import LinkArrowIcon from 'ui/SVG/LinkArrowIcon';
import Magnifier from 'ui/SVG/Magnifier';
import styles from '../styles/ClansNew.module.scss';

interface ClansNewProps {}

enum ProjectsStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

const ClansNew: React.FC<ClansNewProps> = (props) => {
    const [inputVal, setInputVal] = useInput('');
    const [projectsActive, setProjectsActive] = useState<ProjectsStatus>(ProjectsStatus.ACTIVE);

    return (
        <div className={styles.clans}>
            {/* Header */}
            <header className={styles.clans_head}>
                <h2 className={styles.clans_head_title}>Clans</h2>
                <Input
                    placeholder="Search clans"
                    className={styles.clans_head_input}
                    value={inputVal}
                    onChange={setInputVal}
                    icon={<Magnifier className={styles.clans_head_input_magnifier} />}
                />
            </header>
            {/* List */}
            <ul className={styles.clans_list}>
                {clansMockup.map((clan) => (
                    <li className={styles.clans_list_item} key={clan.id}>
                        <div className={styles.clans_list_img}>
                            <img src={clan.img} alt="img" className="img-cover" />
                        </div>
                        <p className={styles.clans_list_name}>{clan.name}</p>
                    </li>
                ))}
            </ul>
            {/* Hat */}
            <Hat className={styles.clans_hat}>
                <HatInfo
                    className={styles.clans_hat_info}
                    img="/mockup/img/cl-1.png"
                    members="11 members"
                    text="Best designers"
                />
                <div className={styles.clans_hat_right}>
                    <HatButton
                        icon={<ChatIcon />}
                        text="Back to Chat"
                        className={styles.clans_hat_chat}
                    />
                    <Settings>
                        <Settings.Item icon="/img/icons/information.svg" title="Option 1" />
                        <Settings.Item icon="/img/icons/off-notifications.svg" title="Option 2" />
                        <Settings.Item icon="/img/icons/change-colors.svg" title="Option 3" />
                    </Settings>
                </div>
            </Hat>
            {/* Projects */}
            <div className={styles.clans_projects}>
                {/* Projects Head */}
                <div className={styles.clans_projects_head}>
                    <h3 className={styles.clans_projects_title}>Projects</h3>
                    <button className={styles.clans_projects_link}>
                        <LinkArrowIcon />
                    </button>
                </div>
                {/* Projects Tabs */}
                <div className={styles.clans_projects_tabs}>
                    {Object.values(ProjectsStatus).map((type) => (
                        <button
                            className={styles.clans_projects_tabs_item}
                            data-active={type === projectsActive}
                            onClick={setProjectsActive.bind(null, type)}
                            key={type}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                {/* Projects List */}
                <ProjectList className={styles.clans_projects_list} projects={[]} />
                {/* Info */}
                <div className={styles.clans_info}>
                    <div className={styles.clans_info_left}>
                        <ClanMembers admin={members[0]} members={members} />
                        <ClanReviews
                            reviews={{
                                rating: 4,
                                votes: 105,
                                popular_reviews: members.slice(0, 2).map((m) => ({
                                    id: Math.random().toString(),
                                    rating: 4,
                                    text: 'I live in any area that drives experience — whether it’s initial exploration, critically refining ...',
                                    user: m,
                                })),
                            }}
                        />
                    </div>
                    <div className={styles.clans_info_right}>
                        <div className={styles.clans_row}>
                            <div className={styles.clans_row_bounty}>
                                <ClanBounty
                                    bounty={{
                                        value: 80,
                                        data: [5, 25, 10, 11, 40],
                                    }}
                                />
                            </div>
                            <div className={styles.clans_row_badges}>
                                <ClanBadges earnedBadges={mockup_clans[0].earned_badges} />
                            </div>
                        </div>
                        <div className={styles.clans_skills}>
                            <ClanSkills skills={mockup_clans[0].skills} />
                        </div>
                        <div className={styles.clans_applications}>
                            <ClanApplications applications={mockup_clans[0].applications} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClansNew;
