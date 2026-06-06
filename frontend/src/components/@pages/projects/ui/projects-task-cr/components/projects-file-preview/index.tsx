import React from 'react';
import { TaskFile } from '@samudai_xyz/gateway-consumer-types';
import DownloadIcon from 'ui/SVG/DownloadIcon';
import TrashIcon from 'ui/SVG/TrashIcon';
import { downloadFile } from 'utils/fileupload/fileupload';
import { FileHelper } from 'utils/helpers/FileHelper';
import css from './projects-file-preview.module.scss';
import { StorageType } from 'utils/types/FileUpload';

interface ProjectsFilePreviewProps {
    file: TaskFile;
}

export const ProjectsFilePreview: React.FC<ProjectsFilePreviewProps> = ({ file }) => {
    const fileName = FileHelper.getOnlyFileName(file.name);
    const fileExt = FileHelper.getFileExt(file.name);
    const isImage = fileExt && FileHelper.extensions.image.includes(fileExt);
    const ipfs = `https://${file.url}.ipfs.w3s.link/`;

    return (
        <div className={css.file} data-analytics-click="file_item">
            <div className={css.files_icon}>
                <img src={FileHelper.getIcon(file.name)} alt="file" />
            </div>
            <p className={css.files_name}>{FileHelper.getOnlyFileName(file.name)}</p>
            <p className={css.files_size}>999 KB</p>
            <a
                download={file.url}
                onClick={() => {
                    downloadFile(file.url, StorageType.SPACES, file.name);
                }}
                className={css.files_download}
                data-analytics-click="download_file"
            >
                <DownloadIcon />
            </a>
            <button
                className={css.files_removeBtn}
                data-analytics-click="delete_file"
                // onClick={onRemove.bind(null, file)}
            >
                <TrashIcon />
            </button>
        </div>
    );
};
