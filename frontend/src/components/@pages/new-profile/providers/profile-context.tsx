import { createContext, useContext } from 'react';
import { useFetchProfile } from '../lib/hooks/use-fetch-profile';
import { getMemberId } from 'utils/utils';

type ProfileState = ReturnType<typeof useFetchProfile> & {
    initiated: boolean;
    isMyProfile: boolean;
};

export const ProfileContext = createContext<ProfileState>({
    code: null,
    count: 0,
    loading: false,
    subdomain: null,
    totalDaos: 0,
    userData: undefined,
    initiated: false,
    isMyProfile: false,
    updateData: () => {},
    contributorProgress: undefined,
});

ProfileContext.displayName = 'ProfileContext';

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const value = useFetchProfile();

    const isMyProfile = value.userData?.member.member_id === getMemberId();

    return (
        <ProfileContext.Provider
            value={{
                ...value,
                isMyProfile,
                initiated: true,
            }}
            data-analytics-page="contributor_profile_page"
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const withProfile = (component: React.ReactNode) => () => {
    const WrappedComponent = () => {
        return <ProfileProvider>{component}</ProfileProvider>;
    };

    WrappedComponent.displayName = `new-profile`;

    return WrappedComponent();
};

export const useProfile = () => {
    return useContext(ProfileContext);
};
