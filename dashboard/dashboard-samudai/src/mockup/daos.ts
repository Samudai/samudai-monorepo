export const mockup_daos: DAOType[] = [
    {
        id: '0d80173a-ed93-402b-9ef1-b46241b52520',
        name: 'ANON_TEST_SERVER',
        token_gating: false,
        guildId: '',
    },
    {
        id: 'b9bcb1d3-4adf-43c1-b71d-114b3896e4de',
        name: 'SAMUDAI_TEST_SERVER',
        token_gating: true,
        guildId: '',
    },
    // {
    //   id: 3,
    //   name: 'DAO3',
    // },
];

export type DAOType = {
    id: string;
    name: string;
    profilePicture?: string;
    token_gating: boolean;
    guildId: string;
};
