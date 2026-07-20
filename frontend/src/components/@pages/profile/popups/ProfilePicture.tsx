import clsx from 'clsx';
import usePopup from 'hooks/usePopup';
import UseOpensea from 'components/@popups/UseOpensea/UseOpensea';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import FileInput from 'ui/@form/FileInput/FileInput';
import GalleryIcon from 'ui/SVG/GalleryIcon';
import styles from '../styles/ProfilePicture.module.scss';
import Sprite from 'components/sprite';

interface ProfilePictureProps {
    avatar: File | string | null;
    className?: string;
    title?: string;
    onChange: (file: File) => void;
    handleNFT: (file: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
    avatar,
    className,
    onChange,
    handleNFT,
    title,
}) => {
    const openSea = usePopup();
    return (
        <div className={clsx(styles.root, className)}>
            {title && (
                <h3 className={styles.title} data-role="title">
                    {title}
                </h3>
            )}
            <div className={styles.row} data-role="row">
                <FileInput className={styles.inputRoot} onChange={onChange} accept="image/*">
                    <div className={styles.input}>
                        <p className={styles.inputRounded}>
                            <div
                                className={clsx('setup-img__upload-img', {
                                    active: avatar instanceof File,
                                })}
                            >
                                <GalleryIcon />
                                {avatar instanceof File && (
                                    <img src={URL.createObjectURL(avatar)} alt="img" />
                                )}
                            </div>
                        </p>
                    </div>
                    <p className={styles.inputText}>
                        <Sprite url="/img/sprite.svg#upload" />
                        <span>Upload</span>
                    </p>
                </FileInput>
                <p className={styles.or}>or</p>
                <button className={styles.inputRoot} onClick={openSea.open}>
                    <div className="setup-img__upload-block">
                        <div
                            className={clsx('setup-img__upload-img', {
                                active: typeof avatar === 'string',
                            })}
                        >
                            {/* <GalleryIcon /> */}
                            <span className={styles.nftSpan}>NFT</span>
                            {typeof avatar === 'string' && <img src={avatar} alt="img" />}
                        </div>
                    </div>
                    <p className={styles.inputText}>Use NFT</p>
                </button>
            </div>
            <PopupBox active={openSea.active} onClose={openSea.close}>
                <UseOpensea handleNFT={handleNFT} onClose={openSea.close} />
            </PopupBox>
        </div>
    );
};

export default ProfilePicture;
