import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import clsx from 'clsx';
import styles from './ProjectNew.module.scss';

interface ProjectNewProps {
    openImport: () => void;
    openCreate: () => void;
    onClose: () => void;
}

const ProjectNew: React.FC<ProjectNewProps> = ({ onClose, openCreate, openImport }) => {
    const handleCreateOpen = () => {
        onClose();
        openCreate();
    };
    const handleImportOpen = () => {
        onClose();
        openImport();
    };

    return (
        <Popup className={styles.root}>
            <PopupTitle icon="/img/icons/setup.png" title="Project Set-up" />
            <div className={styles.controls}>
                <button className={clsx(styles.btn)} onClick={handleCreateOpen}>
                    <div className={styles.icon}>
                        <img src="/img/icons/line-star.png" alt="icon" />
                    </div>
                    <div className={styles.content}>
                        <p>
                            Create <span className="--clr-green">New</span> Project on Samudai
                        </p>
                    </div>
                </button>
                <button className={clsx(styles.btn)} onClick={handleImportOpen}>
                    <div className={styles.icon}>
                        <img src="/img/icons/import.png" alt="icon" />
                    </div>
                    <div className={styles.content}>
                        <p>
                            <span className="--clr-orange">Import</span> project from
                        </p>
                        <ul className={styles.social}>
                            <li className={styles.socialItem}>
                                <div className={styles.socialImg}>
                                    <img src="/img/socials/notion-2.svg" alt="social" />
                                </div>
                            </li>
                            <li className={styles.socialItem}>
                                <img src="/img/socials/github-2.svg" alt="social" />
                            </li>
                        </ul>
                    </div>
                </button>
            </div>
        </Popup>
    );
};

export default ProjectNew;
