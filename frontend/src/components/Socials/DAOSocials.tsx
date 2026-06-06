import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useUpdateDaoSocialsMutation } from 'store/services/Dashboard/dashboard';
import * as SocialIcons from 'ui/SVG/socials';
import SocialsItem from './SocialsItem';
import './DAOSocials.scss';

interface SocialsProps {
    className?: string;
    social?: any;
}

const Socials: React.FC<SocialsProps> = ({ className, social }) => {
    // const user = useTypedSelector(selectUserData);
    const [updateSocial] = useUpdateDaoSocialsMutation();
    const [socials, setSocials] = useState<any>(social);

    useEffect(() => {
        setSocials(social);
    }, [social]);

    return (
        <div className={clsx('socials', className)}>
            <ul className="socials__list">
                <SocialsItem
                    className={clsx(social?.discord ? 'icon-mirror1' : 'icon-mirror')}
                    href={socials?.discord}
                    icon={<SocialIcons.Discord />}
                    analyticsId="social_discord"
                />
                <SocialsItem
                    className={clsx(social?.twitter ? 'icon-mirror1' : 'icon-mirror')}
                    href={socials?.twitter}
                    icon={<SocialIcons.TwitterDAOSocials />}
                    analyticsId="social_twitter"
                />
                <SocialsItem
                    className={clsx(social?.mirror ? 'icon-mirror1' : 'icon-mirror')}
                    href={socials?.mirror}
                    icon={<SocialIcons.Mirror />}
                    analyticsId="social_mirror"
                />
                <SocialsItem
                    className={clsx(social?.website ? 'icon-mirror1' : 'icon-mirror2')}
                    href={socials?.website}
                    icon={<SocialIcons.Website />}
                    analyticsId="social_website"
                />
            </ul>
        </div>
    );
};
export default Socials;
