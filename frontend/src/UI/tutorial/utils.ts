export interface TutorialStep {
    id?: number;
    name: string;
    description: string;
    action?: {
        name: string;
        onClick: () => void;
    };
    skip?: boolean;
}

export const contributorSteps: TutorialStep[] = [
    {
        id: 1,
        name: 'Dashboard',
        description: 'Here’s where you can learn everything that is going in the DAO.',
        skip: true,
    },
    {
        id: 2,
        name: 'Discover',
        description: 'Here’s you can find like minded folks and other DAOs.',
        skip: true,
    },
    {
        id: 3,
        name: 'Jobs',
        description: 'Find all the jobs whether it be tasks or bounties from other DAOs.',
        skip: true,
    },
    {
        id: 4,
        name: 'Notifications and Messages',
        description:
            'Stay updated with everything - Notification and Messages help you stay posted.',
        skip: true,
    },
    {
        id: 5,
        name: 'Set Up Profile',
        description: 'Set up your profile to connect with folks and join other DAOs.',
        skip: true,
    },
];
