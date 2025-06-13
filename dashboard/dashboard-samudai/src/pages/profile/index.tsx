import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import ContributorLayout from 'root/layouts/ContributorLayout/ContributorLayout';
import { selectActiveDao, selectStreamId } from 'store/features/common/slice';
import { editProfileToggle, selectPopups } from 'store/features/popup/slice';
import { getMemberByIdResponse } from 'store/services/userProfile/model';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import ClanSetup from 'components/@pages/profile/popups/ClanSetup';
import EditProfile from 'components/@pages/profile/popups/EditProfile';
import ProfileClans from 'components/@pages/profile/subpages/ClansNew';
import ProfileIndex from 'components/@pages/profile/subpages/Profile';
import ProfileProjects from 'components/@pages/profile/subpages/Projects';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import { getProfileNav } from 'components/new-header/lib/getHeaderNav';
import Button from 'ui/@buttons/Button/Button';
import MedalIcon from 'ui/SVG/MedalIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import Head from 'ui/head';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './profile.module.scss';

// import styles from './Profile.module.scss';

const Tabs: {
    [key: string]: string;
} = {
    Profile: 'profile',
    Projects: 'projects',
    // Clans: 'clans',
};

const getProfileType = (type?: string) => {
    switch (type) {
        case 'profile':
            return Tabs.Profile;
        case 'projects':
            return Tabs.Projects;
        default:
            return Tabs.Profile;
    }
};

const Profile = () => {
    const progress = 2;
    const { type } = useParams<{ type?: string }>();
    const [fetchUserProfile, { isLoading }] = useGetMemberByIdMutation();
    const { isEditProfile } = useTypedSelector(selectPopups);
    const tabActive = useMemo(() => getProfileType(type), [type]);
    const [userData, setUserData] = useState<getMemberByIdResponse>({} as getMemberByIdResponse);
    const dispatch = useTypedDispatch();
    const clanPopup = usePopup();
    const { memberid } = useParams();
    const sameMember = memberid === getMemberId();
    const streamId = useTypedSelector(selectStreamId);
    const navigate = useNavigate();
    const profileNav = getProfileNav();
    const activeDao = useTypedSelector(selectActiveDao);

    useEffect(() => {
        if (type !== undefined && type !== 'profile' && type !== 'projects' && type !== 'clans') {
            return navigate(`/${memberid}/profile`);
        }
    }, [type]);

    useEffect(() => {
        if (!sameMember) delete Tabs?.Projects;
        if (sameMember) Tabs.Projects = 'projects';
        console.log('memberid', memberid);
        fetchUserProfile({
            member: {
                type: 'member_id',
                value: memberid!,
            },
        })
            .unwrap()
            .then((res) => {
                console.log({ res });
                setUserData(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [memberid]);

    const isProfile = tabActive === Tabs.Profile;

    const handleEditOpen = () => {
        dispatch(editProfileToggle(true));
    };

    const handleCloseEdit = () => {
        dispatch(editProfileToggle(false));
    };

    return isLoading ? (
        <Loader />
    ) : (
        <ContributorLayout
            className={isProfile && styles.withSidebar}
            hideSidebar={isProfile}
            data-analytics-page="contributor_profile_page"
        >
            <Head
                classNameRoot={clsx(styles.head, type && styles.headDefault)}
                breadcrumbs={[{ name: 'Account' }, { name: 'Profile' }]}
                data-analytics-parent="my_profile_parent"
            >
                <div className={styles.header}>
                    <Head.Title title="My Profile" />
                    {tabActive === Tabs.Profile && (
                        <Button
                            color="green"
                            className={styles.credentialsBtn}
                            onClick={() => {
                                if (!streamId) {
                                    return toast(
                                        'Failure',
                                        5000,
                                        'No verifiable credentials claimed on this platform',
                                        ''
                                    )();
                                }
                                window.open(
                                    'https://cerscan.com/mainnet/stream/' + streamId,
                                    '_blank'
                                );
                            }}
                            data-analytics-click="verifiable_credentials_claim_check_btn"
                        >
                            <MedalIcon />
                            <span>Credentials</span>
                        </Button>
                    )}
                    {tabActive === Tabs.Clans && (
                        <Button
                            color="green"
                            className={styles.createClanBtn}
                            onClick={clanPopup.open}
                            data-analytics-click="clan_creation_btn"
                        >
                            <PlusIcon />
                            <span>Create Clan</span>
                        </Button>
                    )}
                </div>
            </Head>
            <div className={clsx('container', styles.container)}>
                {tabActive === Tabs.Profile && <ProfileIndex userData={userData} />}
                {tabActive === Tabs.Projects && <ProfileProjects />}
                {tabActive === Tabs.Clans && <ProfileClans />}
            </div>
            <PopupBox active={clanPopup.active} onClose={clanPopup.close}>
                <ClanSetup onClose={clanPopup.close} />
            </PopupBox>
            <PopupBox active={isEditProfile} onClose={handleCloseEdit}>
                <EditProfile onClose={handleCloseEdit} />
            </PopupBox>
        </ContributorLayout>
    );
};

export default Profile;
