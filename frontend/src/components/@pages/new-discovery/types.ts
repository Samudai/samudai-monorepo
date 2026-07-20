export interface DiscoverySortType {
    name: string;
    value: string | number;
}

export interface DiscoveryFilterRange {
    label: string;
    min?: number;
    max?: number;
}

export enum DaoSort {
    LOW_TO_HIGH = 'low-to-high',
    HIGH_TO_LOW = 'high-to-low',
}

export enum ContributorSort {
    OLD_TO_NEW = 'old-to-new',
    NEW_TO_OLD = 'new-to-old',
}

export interface DiscoveryFilterInputs {
    search: string;
    open_to_collaborate: boolean;
    open_for_opportunity: boolean;
    dao_types: string[];
    tags: string[];
    skills: string[];
    members: DiscoveryFilterRange[];
    sort: DiscoverySortType;
}
