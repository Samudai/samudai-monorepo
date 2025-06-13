import { openUrl } from 'utils/linkOpen';

interface SocialsItemProps {
    className?: string;
    href?: string | null;
    icon: JSX.Element;
    analyticsId?: string;
}

const SocialsItem: React.FC<SocialsItemProps> = ({ icon, className, href, analyticsId }) => {
    return (
        <li className="socials__item" data-analytics-click={`${analyticsId}`}>
            {!!href && (
                <a href={openUrl(href)} className={className} target="_blank" rel="noreferrer">
                    {icon}
                </a>
            )}
            {!href && <div className={className}>{icon}</div>}
        </li>
    );
};

export default SocialsItem;
