import React, { useState } from 'react';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { folderRes } from 'store/services/projects/model';
import { useCreateFolderMutation } from 'store/services/projects/totalProjects';
import useInput from 'hooks/useInput';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { File } from 'ui/Attachment';
import FolderIcon from 'ui/SVG/FolderIcon';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './styles/AddNewFolder.module.scss';

interface AddNewFolderProps {
    setFolders: React.Dispatch<React.SetStateAction<folderRes[]>>;
    project: ProjectResponse;
    onClose?: () => void;
}

const AddNewFolder: React.FC<AddNewFolderProps> = ({ onClose, setFolders, project }) => {
    const [folderName, setFolderName] = useInput('');
    const [attachments, setAttachments] = useState<File[]>([]);

    const [createFolder] = useCreateFolderMutation();

    const handleAddFile = (file: File) => {
        setAttachments([...attachments, file]);
    };

    const regex = /^[\w\-\s]+$/;

    const handleFolderAdd = async () => {
        if (!folderName) return toast('Failure', 5000, ' Folder name is required', '')();
        if (!regex.test(folderName))
            return toast('Failure', 5000, ' Folder name cannot contain special characters', '')();
        if (folderName.length > 30)
            return toast(
                'Failure',
                5000,
                ' Folder name is too long',
                'Keep its less than 30 characters long'
            )();
        try {
            const res = await createFolder({
                fileFolder: {
                    folder_id: '',
                    project_id: project.project_id!,
                    name: folderName,
                    description: '',
                    created_by: getMemberId(),
                },
            }).unwrap();
            if (res?.data?.folder_id) {
                setFolders((prev) => {
                    return [
                        ...prev,
                        {
                            folder_id: res.data?.folder_id || '',
                            project_id: project.project_id!,
                            name: folderName,
                            description: '',
                            created_by: getMemberId(),
                            files: [],
                        },
                    ];
                });
            }
            toast('Success', 5000, ' Folder created', '')();
            onClose?.();
        } catch (err) {
            toast('Failure', 5000, 'Failed to create folder', '')();
        }
    };

    return (
        <Popup className={styles.root} onClose={onClose} dataParentId="add_new_folder_modal">
            {/* prettier-ignore */}
            <PopupTitle
        icon={<FolderIcon />}
        title={<>Add <strong>New</strong> Folders</>}
      />
            <Input
                title="Folder name"
                value={folderName}
                onChange={setFolderName}
                className={styles.input}
                data-analytics-click="folder_name_input"
            />
            {/* <div className={styles.attachments}>
        <div className={styles.attachmentsHead}>
          <h3 className={styles.attachmentsTitle}>
            <AttachmentIcon />
            <span>Attachments</span>
            {attachments.length > 0 && <strong>{attachments.length}</strong>}
          </h3>
          <FileInput className={styles.attachmentsBtn} onChange={handleAddFile}>
            <UploadIcon />
            <span>Upload Files</span>
          </FileInput>
        </div>
        <ul className={styles.attachmentsList}>
          {attachments.map((file) => (
            <li className={styles.attachmentsItem}>
              <File
                name={file.name}
                url={file.name}
                size={(file.size / 1000).toString() + ' KB'}
              />
            </li>
          ))}
        </ul>
      </div> */}
            <Button
                color="green"
                className={styles.createBtn}
                onClick={handleFolderAdd}
                data-analytics-click="create_button"
            >
                <span>Create</span>
            </Button>
        </Popup>
    );
};

export default AddNewFolder;
