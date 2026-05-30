import { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as SocialIcons from 'ui/SVG/socials';
import SocialsItem from './SocialsItem';
import './Socials.scss';

interface SocialsProps {
    className?: string;
    social?: {
        type: string;
        url: string;
    }[];
}

const Socials: React.FC<SocialsProps> = ({ className, social }) => {
    // const user = useTypedSelector(selectUserData);
    const [socials, setSocials] = useState<any>({});

    useEffect(() => {
        console.log('social', social);
        const user: any = {};
        social?.forEach((val) => {
            user[val.type] = val.url;
        });
        setSocials(user);
        console.log(user);
    }, [social]);

    return (
        <div className={clsx('socials', className)}>
            <ul className="socials__list">
                {/* <SocialsItem
          className="icon-discord"
          href={socials?.discord}
          icon={<SocialIcons.Discord />}
        /> */}
                <SocialsItem
                    className="icon-linkedin"
                    href={socials?.linkedIn}
                    icon={<SocialIcons.LinkedIn />}
                    analyticsId="social_linkedin"
                />
                <SocialsItem
                    className="icon-github"
                    href={socials?.github}
                    icon={<SocialIcons.Github />}
                    analyticsId="social_github"
                />
                <SocialsItem
                    className="icon-behance"
                    href={socials?.behance}
                    icon={<SocialIcons.Behance />}
                    analyticsId="social_behance"
                />
                <SocialsItem
                    className="icon-dribbble"
                    href={socials?.dribbble}
                    icon={<SocialIcons.Dribbble />}
                    analyticsId="social_dribbble"
                />
                <SocialsItem
                    className="icon-dribbble"
                    href={socials?.twitter}
                    icon={<SocialIcons.Twitter />}
                    analyticsId="social_twitter"
                />
            </ul>
        </div>
    );
};
export default Socials;
