export enum SignUpModals {
    ConnectWallet,
    StartAs,
    ConnectApps,
    ProfileSetup,
    Complete,
}

export interface SignUpState {
    img: File | string | null;
    nickname: string;
    biography: string;
    account_type: 'contributor' | 'admin' | null;
    skills: string[];
    twitter: string;
    behance: string;
    dribbble: string;
    fiverr: string;
    mirror: string;
    department: string[];
}

export interface SignUpStateGetSet {
    state: SignUpState;
    noDepartment?: boolean;
    setState: React.Dispatch<React.SetStateAction<SignUpState>>;
    setEnableNext?: React.Dispatch<React.SetStateAction<boolean>>;
}
