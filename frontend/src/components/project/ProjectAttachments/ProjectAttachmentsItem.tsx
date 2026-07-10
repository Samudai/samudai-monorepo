import React from 'react';
import dayjs from 'dayjs';
import { File } from 'ui/Attachment';
import DownloadIcon from 'ui/SVG/DownloadIcon';
import TrashIcon from 'ui/SVG/TrashIcon';
import { downloadFile } from 'utils/fileupload/fileupload';
import { StorageType } from 'utils/types/FileUpload';
import styles from './styles/ProjectAttachmentsItem.module.scss';

interface ProjectAttachmentsItemProps {
    name: string;
    size?: string;
    url?: string;
    createdAt?: string;
    handleFileDelete: (id: string) => Promise<void>;
    id: string;
    access: boolean;
}

const ProjectAttachmentsItem: React.FC<ProjectAttachmentsItemProps> = ({
    name,
    size = '0KB',
    url = '/unknown',
    createdAt,
    handleFileDelete,
    id,
    access,
}) => {
    console.log(url);
    return (
        <li className={styles.attch}>
            <p className={styles.attch_topdate}>{dayjs(createdAt).format('DD MMM YYYY, h:mm A')}</p>
            <div className={styles.attch_wrapper}>
                {/* <div className={styles.checkboxCol}>
        <Checkbox active={false} className={styles.checkbox} />
      </div> */}
                <div className={styles.fileCol}>
                    <File
                        name={name}
                        url={url}
                        size={size}
                        className={styles.file}
                        download={false}
                    />
                </div>
                {/* <div className={styles.sizeCol}>
        <div className={styles.text}>{size}</div>
      </div> */}
                <div className={styles.dateCol}>
                    <div className={styles.text}>
                        {dayjs(createdAt).format('DD MMM YYYY, h:mm A')}
                    </div>
                </div>
                <div className={styles.controlsCol}>
                    <div className={styles.controls}>
                        <button
                            className={styles.downloadBtn}
                            onClick={() => {
                                downloadFile(url, StorageType.SPACES, name);
                            }}
                        >
                            <DownloadIcon />
                        </button>
                        {access && (
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleFileDelete(id)}
                            >
                                <TrashIcon />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default ProjectAttachmentsItem;
