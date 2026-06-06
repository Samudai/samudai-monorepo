import clsx from 'clsx';
import styles from '../styles/Components.module.scss';

interface NfPersonProps {
    img: string;
    name: string;
    subtext?: string;
    className?: string;
}

interface TitleProps {
    className?: string;
    children?: React.ReactNode;
}

export const NfPerson: React.FC<NfPersonProps> = ({ img, name, className, subtext }) => {
    return (
        <div className={clsx(styles.person, className)}>
            <div className={styles.personImg} data-role="img">
                <img src={img} alt="user" className="img-cover" />
            </div>
            <div className={styles.personContent}>
                <p className={styles.personName} data-role="name">
                    {name}
                </p>
                {subtext && (
                    <p className={styles.personText} data-role="text">
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );
};

export const NfTitle: React.FC<TitleProps> = ({ children, className }) => {
    return (
        <h4 className={clsx(styles.title, className)} data-role="nf-title">
            {children}
        </h4>
    );
};
