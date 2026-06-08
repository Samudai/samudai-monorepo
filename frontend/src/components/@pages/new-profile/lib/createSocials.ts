interface SocialItem {
    name: string;
    url: string;
    icon: string;
}

export const createSocials = (data: Record<string, string | undefined>) => {
    const socials: SocialItem[] = [];

    for (const [name, url] of Object.entries(data)) {
        // if(url === undefined) continue;

        let icon = '/img/sprite.svg#';
        // let lName = name.toLowerCase();

        // if(lName.includes('')) {};
        // else
        icon += name;

        socials.push({
            name,
            url: url || '',
            icon,
        });
    }

    return socials;
};
