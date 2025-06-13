export const getEnablesWordList = (type: string) => {
    if (type === 'dao') {
        return ['Check DAO Analytics', 'Manage Projects', 'Post Jobs'];
    } else if (type === 'contributor') {
        return ['Apply for bounties', 'Manage task', 'become part of the community'];
    } else if (type === 'trial') {
        return ['DAO Analytics', 'Project Management', 'Jobs Posting', 'Forums'];
    } else {
        return [
            'Manage Token Gating',
            'Manage Bounties',
            'Manage Community Analytics',
            'Set Up Payouts',
            'Interact with DAOs',
        ];
    }
};
