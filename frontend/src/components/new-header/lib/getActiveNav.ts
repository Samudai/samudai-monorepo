import { HeaderNavSubLinkPayload, getHeaderNav, getProfileNav } from './getHeaderNav';

export const getActiveNav = (pathname: string, payload?: HeaderNavSubLinkPayload) => {
    for (const group of [...getHeaderNav(), getProfileNav()]) {
        for (const link of group.sublinks) {
            const href = link.getHref(payload);
            const similar = link.exact ? pathname === href : pathname.startsWith(href);
            if (similar) {
                const groupName = group.name;
                const links = group.sublinks.slice();

                return { groupName, links };
            }
        }
    }

    return {
        groupName: '',
        links: [],
    };
};
