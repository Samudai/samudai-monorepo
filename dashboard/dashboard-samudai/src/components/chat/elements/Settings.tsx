import clsx from 'clsx';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import styles from '../styles/HatSettings.module.scss';

interface HatSettingsProps {
    className?: string;
    children?: React.ReactNode;
}

interface HatSettingsItemProps {
    className?: string;
    icon: string;
    title: string;
    popup?: JSX.Element | false;
    onClick?: () => void;
}

const HatSettings: React.FC<HatSettingsProps> = ({ className, children }) => {
    return <SettingsDropdown className={clsx(styles.root, className)}>{children}</SettingsDropdown>;
};

const HatSettingsItem: React.FC<HatSettingsItemProps> = ({
    onClick,
    className,
    icon,
    title,
    popup,
}) => {
    return (
        <SettingsDropdown.Item className={clsx(styles.settingsItem, className)}>
            <div
                className={styles.settingsItemInner}
                onClick={onClick}
                data-analytics-click={'settings_item_' + title}
            >
                <div className={styles.settingsItemIcon}>
                    <img src={icon} alt="icon" />
                </div>
                <p className={styles.settingsItemName}>{title}</p>
            </div>
            {popup}
        </SettingsDropdown.Item>
    );
};

export default Object.assign(HatSettings, { Item: HatSettingsItem });
