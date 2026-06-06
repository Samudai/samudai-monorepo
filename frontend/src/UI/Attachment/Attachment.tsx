import clsx from 'clsx';
import { cutText } from 'utils/format';
import { FileHelper } from 'utils/helpers/FileHelper';
import styles from './styles/Attachment.module.scss';

interface AttachmentProps {
    className?: string;
    name: string;
    url: string;
}

const Attachment: React.FC<AttachmentProps> = ({ name, url, className }) => {
    const fileName = FileHelper.getOnlyFileName(name);
    const fileExt = FileHelper.getFileExt(name);
    const isImage = fileExt && FileHelper.extensions.image.includes(fileExt);
    const ipfs = `https://${url}.ipfs.w3s.link/`;

    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.imageContainer} id="xyz" data-role="container">
                {isImage && <img src={url} alt="img" className="img-cover" />}
                {!isImage && (
                    <p className={styles.imageText} data-role="text">
                        <span>.{fileExt}</span>
                    </p>
                )}
            </div>
            <p className={styles.imageName} data-role="name">
                {/* {cutText(fileName, 13)}
        <strong>.{fileExt}</strong> */}
                <a href={ipfs} target="_blank" rel="noreferrer">
                    {cutText(name, 20)}
                </a>
            </p>
        </div>
    );
};

export default Attachment;
