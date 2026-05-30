import { useEffect, useState } from 'react';
import React from 'react';
import clsx from 'clsx';
import { previewFile } from 'utils/fileupload/fileupload';
import { FileHelper } from 'utils/helpers/FileHelper';
import { openUrl } from 'utils/linkOpen';
import styles from './styles/File.module.scss';
import { FileIcon } from 'components/@pages/forum/ui/icons/file-icon';
import { StorageType } from 'utils/types/FileUpload';

interface FileProps {
    className?: string;
    name: string;
    url: string;
    size: string;
    download?: boolean;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const File: React.FC<FileProps> = ({ name, size, url, className, onClick, download = true }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        (async () => {
            if (!url.startsWith('blob')) {
                const imageurl = await previewFile(url, StorageType.IPFS, name);
                setImageUrl(imageurl);
            } else {
                setImageUrl(url);
            }
        })();
    }, []);

    return (
        <a
            href={download && openUrl(url)}
            target="_blank"
            className={clsx(styles.root, className)}
            download={download}
            onClick={onClick}
            rel="noreferrer"
        >
            <div className={styles.icon} data-class="icon">
                <FileIcon color="#fdc087" />
            </div>
            <div className={styles.info} data-role="info">
                <h4 className={styles.name} data-role="name">
                    {FileHelper.getName(name)}
                </h4>
                <p className={styles.size} data-role="size">
                    {size}
                </p>
            </div>
        </a>
    );
};

export default File;
