import { LogHead, LogItem } from '../ui';
import { mockup_projectFiles } from 'root/mockup/files';
import { mockup_users } from 'root/mockup/users';
import { FileHelper } from 'utils/helpers/FileHelper';
import styles from './logs-files.module.scss';

interface LogFilesProps {}

export const LogFiles: React.FC<LogFilesProps> = (props) => {
    return (
        <LogItem icon="/img/icons/activity-file.svg">
            <LogHead
                user={mockup_users[1]}
                data={mockup_users[1]}
                addedAt="2022-09-18T08:12:58.391Z"
            >
                3 New Incoming Project Files:
            </LogHead>
            <ul className={styles.files}>
                {mockup_projectFiles.map((file) => (
                    <li className={styles.fileItem} key={file.project_file_id}>
                        <div className={styles.fileIcon}>
                            <img src={FileHelper.getIcon(file.name)} alt="file" />
                        </div>
                        <div className={styles.fileData}>
                            <h4 className={styles.fileName}>{FileHelper.getName(file.name)}</h4>
                            {/* <p className={styles.fileSize}>{file.metadata.size}</p> */}
                        </div>
                    </li>
                ))}
            </ul>
        </LogItem>
    );
};
