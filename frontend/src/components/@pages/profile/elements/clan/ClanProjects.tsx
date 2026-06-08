import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { IClanInfoProject } from 'utils/types/Clan';
import BookIcon from 'ui/SVG/BookIcon';
import LinkArrowIcon from 'ui/SVG/LinkArrowIcon';
import MarkIcon from 'ui/SVG/MarkIcon';
import styles from '../../styles/Widgets.module.scss';

interface ProjectsProps {
    projects: {
        active: IClanInfoProject[];
        completed: IClanInfoProject[];
    };
}

const Tabs = {
    Active: 'active',
    Completed: 'completed',
};

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
    const [activeTab, setActiveTab] = useState<string>(Tabs.Active);

    const currentProjects = activeTab === Tabs.Active ? projects.active : projects.completed;

    return (
        <div className={styles.widget}>
            <header className={styles.header}>
                <h3 className={styles.title}>Projects</h3>
                <NavLink to="#" className={styles.link}>
                    <LinkArrowIcon />
                </NavLink>
            </header>
            <div className={styles.content}>
                <div className={styles.projectTabs}>
                    {Object.values(Tabs).map((tab) => (
                        <button
                            key={tab}
                            className={clsx(
                                styles.projectTab,
                                activeTab === tab && styles.projectTabActive
                            )}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <ul className={styles.projectList}>
                    {currentProjects.map((project) => (
                        <li className={styles.projectItem} key={project.id}>
                            <BookIcon className={styles.projectBook} />
                            <p className={styles.projectName}>{project.title}</p>
                            {project.progress < 100 && (
                                <p className={styles.projectProgress}>{project.progress}%</p>
                            )}
                            {project.progress === 100 && (
                                <MarkIcon className={styles.projectMark} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Projects;
