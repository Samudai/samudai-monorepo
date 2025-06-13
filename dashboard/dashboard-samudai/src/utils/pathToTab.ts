type PathTabs = Record<string, string>;

type PathToTabType = (obj: PathTabs, location: string, defaultValue?: string) => string;

export const pathToTab: PathToTabType = (obj, location, defaultValue) => {
    let tab = '';

    for (const path of Object.values(obj)) {
        const regex = new RegExp(`\/${path}(\/|\/.*)?$`, 'i');

        if (regex.test(location)) {
            tab = path;
            break;
        }
    }

    if (tab === '' && defaultValue) {
        tab = defaultValue;
    }

    return tab;
};
