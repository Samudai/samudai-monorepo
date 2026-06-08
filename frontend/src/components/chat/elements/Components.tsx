import clsx from 'clsx';
import styles from '../styles/Components.module.scss';

interface TitleProps {
    className?: string;
    text: string;
}

interface AvatarProps {
    className?: string;
    img: string;
}

interface ButtonProps {
    className?: string;
    icon?: JSX.Element;
    text: string;
    onClick?: () => void;
}

interface InfoProps {
    className?: string;
    members: string;
    text: string;
    img: string;
}

export const HatTitle: React.FC<TitleProps> = ({ text, className }) => (
    <h3 className={clsx(styles.title, className)}>{text}</h3>
);

export const HatAvatar: React.FC<AvatarProps> = ({ img, className }) => (
    <div className={clsx(styles.avatar, className)}>
        <img src={img} alt="avatar" className="img-cover" />
    </div>
);

export const HatButton: React.FC<ButtonProps> = ({ icon, className, text, onClick }) => (
    <button className={clsx(styles.button, className)} onClick={onClick}>
        {icon && <div className={styles.buttonIcon}>{icon}</div>}
        <span className={styles.buttonText}>{text}</span>
    </button>
);

export const HatInfo: React.FC<InfoProps> = ({ img, className, members, text }) => (
    <div className={clsx(styles.info, className)}>
        <HatAvatar img={img} />
        <div className={styles.infoContent} data-class="info-content">
            <HatTitle text={text} />
            <p className={styles.infoMembers}>{members}</p>
        </div>
    </div>
);
