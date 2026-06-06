import { useState } from 'react';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import usePopup from 'hooks/usePopup';
// import { IMember } from 'store/services/projects/model';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import DeletePopUp from 'components/UserProfile/DeleteTaskPopUp';
import Button from 'ui/@buttons/Button/Button';
import { IMember } from 'utils/types/User';
import Managment from './Managment';
import Project from './Project';
import styles from '../styles/ProjectSettings.module.scss';

interface ProjectSettingsProps {
    onClose?: () => void;
    project: ProjectResponse;
    members: IMember[];
}

enum Tabs {
    PROJECT = 'Project',
    ACCESS_MANAGMENT = 'Access Managment',
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ onClose, project, members }) => {
    const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.PROJECT);
    const deletePopUp = usePopup();

    return (
        <Popup className={styles.root} onClose={onClose} dataParentId="project_settings_modal">
            <h2 className={styles.title}>Settings</h2>
            <div className={styles.container}>
                <div className={styles.left}>
                    <ul className={styles.tabs}>
                        {Object.values(Tabs).map((tab) => (
                            <li
                                className={styles.tabsItem}
                                data-active={tab === currentTab}
                                onClick={() => setCurrentTab(tab)}
                                key={tab}
                                data-analytics-click={tab}
                            >
                                {tab}
                            </li>
                        ))}
                    </ul>
                    {currentTab === Tabs.PROJECT && (
                        <div className={styles.remove}>
                            <div className={styles.remove_head}>
                                <h3 className={styles.remove_title}>Delete Project</h3>
                                <Button
                                    className={styles.remove_btn}
                                    onClick={deletePopUp.open}
                                    color="red"
                                    data-analytics-click="delete_button"
                                >
                                    <span>Delete</span>
                                </Button>
                            </div>

                            <p className={styles.remove_text}>
                                Deleting a project will permanently delete release attachments and
                                team permissions. This action cannot be undone.
                            </p>
                        </div>
                    )}
                </div>
                <div className={styles.right}>
                    {currentTab === Tabs.PROJECT && (
                        <Project project={project} onClose={onClose} users={members} />
                    )}
                    {currentTab === Tabs.ACCESS_MANAGMENT && <Managment project={project} />}
                </div>
            </div>
            {project?.project_id && (
                <PopupBox active={deletePopUp.active} onClose={deletePopUp.close}>
                    <DeletePopUp onClose={deletePopUp.close} id={project.project_id} project />
                </PopupBox>
            )}
        </Popup>
    );
};

export default ProjectSettings;
