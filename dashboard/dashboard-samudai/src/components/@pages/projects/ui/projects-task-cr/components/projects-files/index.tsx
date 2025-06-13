import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectsFilePreview } from '../projects-file-preview';
import { NotificationsEnums, TaskFile } from '@samudai_xyz/gateway-consumer-types';
import { useScrollbar } from 'hooks/useScrollbar';
import FileInput from 'ui/@form/FileInput/FileInput';
import UploadIcon from 'ui/SVG/UploadIcon';
import { uploadFile } from 'utils/fileupload/fileupload';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import { getMemberId } from 'utils/utils';
import css from './projects-files.module.scss';

interface ProjectsFilesProps {
    taskId: string;
    files: TaskFile[];
    updateDetails: () => void;
    access?: boolean;
}

const validExtensions = ['pdf', 'doc', 'csv', 'xlsx', 'docx', 'png', 'jpg', 'jpeg'];

export const ProjectsFiles: React.FC<ProjectsFilesProps> = ({
    taskId,
    files,
    updateDetails,
    access,
}) => {
    const { ref: listRef, isScrollbar } = useScrollbar<HTMLUListElement>();
    const { daoid, projectId } = useParams<{
        daoid: string;
        projectId: string;
    }>();
    const member_id = getMemberId();

    // const onRemove = (file: File) => {
    //     onChange(files.filter((f) => f !== file));
    // };

    const handleFileLoad = async (file: File | null) => {
        const ext = file?.name.split('.').pop();
        if (ext && !validExtensions.includes(ext))
            return toast('Failure', 5000, 'Invalid file type', '')();
        if (!file) return toast('Failure', 5000, 'Invalid file type', '')();
        if (file?.size > 1e7) return toast('Failure', 5000, 'File size too large', '')();
        toast('Attention', 5000, 'Uploading file...', '')();
        await uploadFile(file, FileUploadType.TASK, StorageType.SPACES, taskId)
            .then(() => {
                toast('Success', 5000, 'File uploaded successfully', '')();
                updateDetails();
                sendNotification({
                    to: [daoid!],
                    for: NotificationsEnums.NotificationFor.ADMIN_MEMBER,
                    from: member_id,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: taskId,
                        redirect_link: `/${daoid}/projects/${projectId}/board`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceProject.ATTACHMENT_ADDED_TO_TASK,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to upload file', '')();
            });
    };

    return (
        <div className={css.files}>
            <div className={css.files_head}>
                <h3 className={css.files_count}>{files.length} items</h3>
                {access && (
                    <FileInput
                        name="media"
                        onChange={handleFileLoad}
                        className={css.files_uploadBtn}
                        dataAnalyticsId="task_upload_file_button"
                    >
                        <UploadIcon />
                        <span>Upload Files</span>
                    </FileInput>
                )}
            </div>
            {files.length > 0 && (
                <ul className={css.files_list}>
                    {files.map((file) => (
                        <li className={css.files_item} key={file.task_file_id}>
                            <ProjectsFilePreview file={file} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
