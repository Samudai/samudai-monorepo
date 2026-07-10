import { folderRes } from 'store/services/projects/model';
import { useDeleteFolderMutation } from 'store/services/projects/totalProjects';
import DocumentIcon from 'ui/SVG/DocumentIcon';
import FolderIcon from 'ui/SVG/FolderIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { toast } from 'utils/toast';
import styles from './styles/ProjectFolder.module.scss';

interface ProjectFolderProps {
    name: string;
    files: number;
    id: string;
    setFolders: React.Dispatch<React.SetStateAction<folderRes[]>>;
    access: boolean;
}

const ProjectFolder: React.FC<ProjectFolderProps> = ({ name, files, setFolders, id, access }) => {
    const [deleteFolder] = useDeleteFolderMutation();
    const handleDelete = async () => {
        try {
            await deleteFolder(id).unwrap();
            setFolders((prev) => prev.filter((folder) => folder.folder_id !== id));
            toast('Success', 5000, ' Folder deleted', '');
        } catch {
            toast('Failure', 5000, ' Folder not deleted', '');
        }
    };
    return (
        <div className={styles.root}>
            <div className={styles.head}>
                <FolderIcon className={styles.folder} />
                {access && (
                    <SettingsDropdown className={styles.settings}>
                        <SettingsDropdown.Item onClick={handleDelete}>
                            Delete Folder
                        </SettingsDropdown.Item>
                        {/* <SettingsDropdown.Item>Item 2</SettingsDropdown.Item>
          <SettingsDropdown.Item>Item 3</SettingsDropdown.Item> */}
                    </SettingsDropdown>
                )}
            </div>
            <p className={styles.name}>{name}</p>
            <div className={styles.files}>
                <DocumentIcon />
                <p>{files} Files</p>
            </div>
        </div>
    );
};

export default ProjectFolder;
