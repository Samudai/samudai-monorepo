interface SettingsRoute {
    baseURL: string;
    links: {
        [key: string]: {
            path: string;
            anchors: {
                name: string;
                hash: string;
            }[];
        };
    };
}

export function getSettingRoutes(daoid: string, memberId: string): SettingsRoute[] {
    return [
        {
            baseURL: `/${daoid}/settings/dao`,
            links: {
                Profile: {
                    path: '',
                    anchors: [],
                },
                'Access Managment': {
                    path: '/access-managment',
                    anchors: [],
                },
                Integrations: {
                    path: '/integrations',
                    anchors: [],
                },
                Departments: {
                    path: '/departments',
                    anchors: [],
                },
                Billing: {
                    path: '/billing-stripe',
                    anchors: [],
                },
            },
        },
        {
            baseURL: `/${memberId}/settings/contributor`,
            links: {
                Profile: {
                    path: '',
                    anchors: [
                        { name: 'About You', hash: '#about' },
                        { name: 'Porfolio Links', hash: '#links' },
                        { name: 'Skills', hash: '#skills' },
                        { name: 'Hourly Rate', hash: '#rate' },
                    ],
                },
                'Connected Apps': {
                    path: '/apps',
                    anchors: [],
                },
            },
        },
    ];
}
