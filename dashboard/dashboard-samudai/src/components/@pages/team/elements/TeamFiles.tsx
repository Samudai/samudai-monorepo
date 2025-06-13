import { ProjectFile } from '@samudai_xyz/gateway-consumer-types/dist/types';
import Attachment from 'ui/Attachment/Attachment';
import styles from '../styles/TeamFiles.module.scss';

interface TeamFilesProps {
    files: ProjectFile[];
}

const TeamFiles: React.FC<TeamFilesProps> = ({ files }) => {
    return (
        <div className={styles.root}>
            <ul className={styles.list}>
                {files.map((file) => (
                    <li className={styles.item} key={file.project_file_id}>
                        <Attachment name={file.name} url={file.url} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamFiles;
