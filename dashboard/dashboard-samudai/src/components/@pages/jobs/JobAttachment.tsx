import React, { useState } from 'react';
import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import FileInput from 'ui/@form/FileInput/FileInput';
import { File } from 'ui/Attachment';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import { toast } from 'utils/toast';
import styles from './styles/JobAttachment.module.scss';

interface JobAttachmentProps {
    files: File[];
    onChange: (files: File[]) => void;
}

const JobAttachment: React.FC<JobAttachmentProps> = ({ files, onChange }) => {
    const [isDragOver, setDragOver] = useState(false);

    const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        setDragOver(true);
    };
    const handleDragLeave = () => {
        setDragOver(false);
    };
    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        onChange([...files, ...Array.from(ev.dataTransfer.files)]);
        setDragOver(false);
    };
    const handleRemoveById = (id: number) => {
        onChange(files.filter((_, idx) => idx !== id));
    };

    const handleAddFile = (file: File) => {
        const validExtensions = ['pdf', 'doc', 'csv', 'xlsx', 'docx', 'png', 'jpg', 'jpeg', 'json'];
        const ext = file?.name.split('.').pop();
        if (ext && !validExtensions.includes(ext))
            return toast('Failure', 5000, 'Invalid file type', '')();
        if (!file) return toast('Failure', 5000, 'Invalid file type', '')();
        if (file?.size > 1e7) return toast('Failure', 5000, 'File size too large', '')();

        onChange([...files, file]);
    };

    return (
        <FileInput
            className={clsx(
                styles.attachments,
                isDragOver && styles.attachmentsOver,
                files.length > 0 && styles.attachmentsHasFiles
            )}
            onChange={(file) => handleAddFile(file)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <p className={styles.attachments_placeholder}>
                <AttachmentIcon />
                <span>Add attachment</span>
            </p>
            {files.length > 0 && (
                <ul className={styles.attachments_list}>
                    {files.map((file, id) => (
                        <li
                            className={styles.attachments_item}
                            key={file.name}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <File
                                name={file.name}
                                size={(file.size / 1_000_000).toFixed(2) + 'MB'}
                                url={URL.createObjectURL(file)}
                                download={false}
                            />
                            <CloseButton
                                className={styles.attachments_remove}
                                onClick={handleRemoveById.bind(null, id)}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </FileInput>
    );
};

export default JobAttachment;
