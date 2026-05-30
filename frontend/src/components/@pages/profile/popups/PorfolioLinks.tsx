import * as Socials from 'UI/SVG/socials';
import clsx from 'clsx';
import PorfolioLinksItem from './PorfolioLinksItem';
import styles from '../styles/PorfolioLinks.module.scss';

interface PorfolioLinksProps {
    className?: string;
    links: FormDataLinksType;
    filledLinks?: FormDataLinksType;
    onChange: (name: keyof FormDataLinksType) => (value: string) => void;
}

export type FormDataLinkFilledType = {
    [T in keyof FormDataLinksType]?: boolean;
};

export interface FormDataLinksType {
    twitter: string;
    behance: string;
    dribbble: string;
    mirror: string;
    fiverr?: string;
    linkedIn?: string;
    github?: string;
    discord?: string;
    website?: string;
}

type OrderType = {
    name: keyof FormDataLinksType;
    icon: JSX.Element;
};
type OrderType2 = Record<
    keyof FormDataLinksType,
    {
        icon: JSX.Element;
        placeholder: string;
        checkValue?: string;
    }
>;

const order: OrderType[] = [
    {
        name: 'twitter',
        icon: <Socials.Twitter />,
    },
    {
        name: 'behance',
        icon: <Socials.Behance />,
    },
    {
        name: 'dribbble',
        icon: <Socials.Dribbble />,
    },
    {
        name: 'mirror',
        icon: <Socials.Mirror />,
    },
    {
        name: 'fiverr',
        icon: <Socials.Fiverr />,
    },
    {
        name: 'linkedIn',
        icon: <Socials.LinkedIn />,
    },
    {
        name: 'github',
        icon: <Socials.Github2 />,
    },
    {
        name: 'discord',
        icon: <Socials.Discord />,
    },
    {
        name: 'website',
        icon: <Socials.Website />,
    },
];

const order2: OrderType2 = {
    behance: {
        icon: <Socials.Behance />,
        placeholder: 'https://www.behance.net/username',
        checkValue: 'https://www.behance.net/',
    },
    twitter: {
        icon: <Socials.Twitter />,
        placeholder: 'https://twitter.com/username',
        checkValue: 'https://twitter.com/',
    },
    dribbble: {
        icon: <Socials.Dribbble />,
        placeholder: 'https://dribbble.com/username',
        checkValue: 'https://dribbble.com/',
    },
    fiverr: {
        icon: <Socials.Fiverr />,
        placeholder: 'https://fiverr.com/username',
        checkValue: 'https://fiverr.com/',
    },
    github: {
        icon: <Socials.Github2 />,
        placeholder: 'https://github.com/username',
        checkValue: 'https://github.com/',
    },
    linkedIn: {
        icon: <Socials.LinkedIn />,
        placeholder: 'https://linkedin.com/in/username',
        checkValue: 'https://linkedin.com/',
    },
    mirror: {
        icon: <Socials.Mirror />,
        placeholder: 'https://mirror.xyz/username',
        checkValue: 'https://mirror.xyz/',
    },
    discord: {
        icon: <Socials.Discord />,
        placeholder: 'https://discord.com/users/username',
        checkValue: 'https://discord.com/',
    },
    website: {
        icon: <Socials.Website />,
        placeholder: 'https://website.com/',
        checkValue: '',
    },
};

const PorfolioLinks: React.FC<PorfolioLinksProps> = ({
    className,
    links,
    filledLinks,
    onChange,
}) => {
    return (
        <div className={clsx(styles.root, className)}>
            <ul className={styles.list}>
                {Object.entries(links).map(([name, value]) => {
                    const fieldName = name as keyof FormDataLinksType;

                    return (
                        <PorfolioLinksItem
                            icon={order2?.[fieldName]?.icon}
                            value={value}
                            name={fieldName.toLowerCase()}
                            onChange={onChange(fieldName)}
                            initialValue={filledLinks?.[fieldName]}
                            placeholder={order2?.[fieldName]?.placeholder || name}
                            key={name}
                        />
                    );
                })}
            </ul>
        </div>
    );
};

export default PorfolioLinks;
