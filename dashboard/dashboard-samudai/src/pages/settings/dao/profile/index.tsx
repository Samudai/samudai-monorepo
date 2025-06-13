import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import SettingsLayout from 'root/layouts/settings/settings.layout';
import {
    changeDaoProgress,
    selectAccessList,
    selectActiveDao,
    selectDaoProgress,
} from 'store/features/common/slice';
import {
    useLazyGetDaoByDaoIdQuery,
    useUpdateDaoMutation,
    useUpdateDaoProfilePicMutation,
    useUpdateDaoProgressMutation,
} from 'store/services/Dao/dao';
import { useObjectState } from 'hooks/use-object-state';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { getSettingsRoutes } from 'pages/settings/utils/settings-routes';
import PorfolioLinks, { FormDataLinksType } from 'components/@pages/profile/popups/PorfolioLinks';
import ProfilePicture from 'components/@pages/profile/popups/ProfilePicture';
import { SettingsPoc } from 'components/@pages/settings';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import { InputEditable } from 'ui/@form/input-editable';
import Switch from 'ui/Switch/Switch';
import { toast } from 'utils/toast';
import { IMember } from 'utils/types/User';
import css from './profile.module.scss';
import EditProfileSkills from 'components/@pages/profile/popups/EditProfileSkills';
import { useGetDaoTagsQuery } from 'store/services/Discovery/Discovery';
import { getMemberId } from 'utils/utils';

const getDefaultLinks = () => ({
    twitter: '',
    behance: '',
    dribbble: '',
    mirror: '',
    fiverr: '',
    linkedIn: '',
    github: '',
    discord: '',
    website: '',
});

interface Inputs {
    bio: string;
    member_application: string;
    poc: IMember | null;
    open_to_collaborate: boolean;
    works: string[];
    links: FormDataLinksType;
    avatar: File | null;
    NFT: string | null;
    profile_picture: string;
}

const Profile: React.FC = () => {
    const [state, setState] = useObjectState<Inputs>({
        bio: '',
        member_application: '',
        poc: null,
        open_to_collaborate: true,
        works: [],
        links: getDefaultLinks(),
        avatar: null,
        NFT: null,
        profile_picture: '',
    });
    const [picUrl, setPicUrl] = useState<string>('');
    const [btnLoading, setBtnLoading] = useState(false);

    const { daoid } = useParams();
    const access = useTypedSelector(selectAccessList)[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const [getDaoDetails, { data: daoData }] = useLazyGetDaoByDaoIdQuery();
    const [updateDaoDetails] = useUpdateDaoMutation();
    const [uploadProfilePic] = useUpdateDaoProfilePicMutation();
    const { data: allTags } = useGetDaoTagsQuery();
    const navigate = useNavigate();
    const currentDaoId = useTypedSelector(selectActiveDao);
    const currDaoProgress = useTypedSelector(selectDaoProgress);
    const dispatch = useTypedDispatch();

    const [updateDaoProgress] = useUpdateDaoProgressMutation();

    useEffect(() => {
        if (!access) {
            navigate(`/${getMemberId()}/settings/contributor`);
        }
    }, [access]);

    const handleAvatar = (file: File) => {
        if (file!.size > 1500000) {
            toast('Failure', 5000, 'Please Select an Image less than 1.5MB', '')();
            return;
        }
        setState({ avatar: file, NFT: null });
        const imageData = new FormData();
        imageData.append('file', file!);
        imageData.append('daoId', daoid!);
        imageData.append('typeOfProfilePicture', '0');
        imageData.append('nftProfilePicture', '0');
        uploadProfilePic(imageData)
            .unwrap()
            .then((res) => {
                setPicUrl(res?.profilePicture ? res?.profilePicture : picUrl);
            })
            .catch((err) => {
                console.log(err);
                toast('Failure', 5000, 'Profile Picture update failed', '')();
            });
    };

    const handleNFT = (file: string) => {
        setPicUrl(file);
        setState({ NFT: file, avatar: null });
    };

    const handleLinks = (name: keyof FormDataLinksType) => {
        return (value: string) => {
            setState({ ...state, links: { ...state.links, [name]: value } });
        };
    };

    const hasNonEmptyStringValue = (links: FormDataLinksType) => {
        const values = Object.values(links);
        return values.some((value) => typeof value === 'string' && value.trim() !== '');
    };

    const handleAddTag = (tag: string) => {
        setState({ ...state, works: [...state.works, tag] });
    };

    const handleRemoveTag = (tag: string) => {
        setState({
            ...state,
            works: state.works.filter((t) => t !== tag),
        });
    };

    const handleSubmit = async () => {
        if (!state.bio) return toast('Failure', 5000, 'Bio is required', '')();
        if (!hasNonEmptyStringValue(state.links))
            return toast('Failure', 5000, 'Atleast 1 social link is required', '')();
        if (!state.poc?.member_id)
            return toast('Failure', 5000, 'Point of contact for DAO is required', '')();
        if (!state.works.length) return toast('Failure', 5000, 'Type of work is required', '')();
        const {
            roles,
            socials,
            onboarding,
            members_count,
            poc_member,
            created_at,
            updated_at,
            ...restDaoData
        } = daoData?.data?.dao || {};
        setBtnLoading(true);
        try {
            const payload = {
                daoProfile: {
                    ...restDaoData,
                    about: state.bio,
                    poc_member_id: state.poc?.member_id,
                    open_to_collaboration: state.open_to_collaborate,
                    tags: state.works,
                    join_dao_link: state.member_application,
                    profile_picture: picUrl || state.profile_picture,
                },
                socials: Object.keys(state.links).map((link) => ({
                    dao_id: daoData?.data?.dao.dao_id,
                    type: link,
                    url: state.links[link as keyof FormDataLinksType],
                })),
            };
            await updateDaoDetails(payload)
                .unwrap()
                .then(() => {
                    toast('Success', 5000, 'Updated Successfuly', '')();
                    if (!currDaoProgress.setup_dao_profile)
                        updateDaoProgress({
                            daoId: daoid!,
                            itemId: [ActivityEnums.NewDAOItems.SETUP_DAO_PROFILE],
                        }).then(() => {
                            dispatch(
                                changeDaoProgress({
                                    daoProgress: {
                                        ...currDaoProgress,
                                        setup_dao_profile: true,
                                    },
                                })
                            );
                        });
                })
                .catch(() => {
                    toast('Failure', 5000, 'Failed to update DAO details', '')();
                });
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        } finally {
            setBtnLoading(false);
        }
    };

    useEffect(() => {
        const dao = daoData?.data?.dao;
        const socials = getDefaultLinks();
        dao?.socials?.forEach(
            (val: any) => (socials[val.type as keyof FormDataLinksType] = val.url)
        );
        if (dao) {
            setState({
                bio: dao.about || '',
                poc: dao.poc_member || null,
                open_to_collaborate: dao.open_to_collaboration,
                works: dao.tags || [],
                links: socials,
                member_application: dao.join_dao_link || '',
            });
        }
    }, [daoData]);

    useEffect(() => {
        daoid && getDaoDetails(daoid);
    }, [daoid]);

    return (
        <SettingsLayout routes={getSettingsRoutes}>
            <React.Suspense fallback={<Loader />}>
                <div className={css.root} data-analytics-page="settings_dao_profile_page">
                    <div
                        className={css.wrapper}
                        data-analytics-parent="settings_dao_profile_parent"
                    >
                        <div className={css.item}>
                            <ProfilePicture
                                title="Profile picture"
                                className={css.avatar}
                                avatar={state.avatar || state.NFT}
                                onChange={handleAvatar}
                                handleNFT={handleNFT}
                            />
                        </div>

                        <div className={css.item}>
                            <h3 className={css.title}>BIO*</h3>

                            <TextArea
                                placeholder="BIO"
                                value={state.bio}
                                onChange={(ev) => setState({ bio: ev.target.value })}
                                className={css.textarea}
                                data-analytics-click="settings_dao_bio_input"
                            />
                        </div>

                        <div className={css.item}>
                            <h3 className={css.title}>New Member Application Link</h3>

                            <InputEditable
                                input={state.member_application}
                                onChange={(member_application) => setState({ member_application })}
                                placeholder="Add Link"
                                data-analytics-click="settings_dao_member_application_input"
                            />
                        </div>

                        <div className={css.item}>
                            <h3 className={css.title}>Social links* (atleast 1)</h3>
                            <PorfolioLinks
                                className={css.portfolioLinks}
                                links={state.links}
                                filledLinks={{} as any}
                                onChange={handleLinks}
                            />
                        </div>

                        <div className={css.item}>
                            <h3 className={css.title}>Select Point of Contact for DAO*</h3>

                            <SettingsPoc
                                value={state.poc}
                                onChange={(poc) => setState({ poc })}
                                daoId={daoid}
                            />
                        </div>

                        <div className={css.item}>
                            <div className={css.openFor}>
                                <h3 className={css.openFor_title}>Open to Collaborate</h3>
                                <Switch
                                    className={css.openFor_switch}
                                    active={state.open_to_collaborate}
                                    onClick={() =>
                                        setState({
                                            open_to_collaborate: !state.open_to_collaborate,
                                        })
                                    }
                                    data-analytics-click="settings_dao_open_for_jobs_switch_btn"
                                />
                            </div>
                        </div>

                        <div className={css.item}>
                            <EditProfileSkills
                                title="Type of work*"
                                subtitle="Your Tags"
                                className={css.skills}
                                skills={state.works}
                                hints={allTags?.data?.tags || []}
                                onAddSkill={handleAddTag}
                                onRemoveSkill={handleRemoveTag}
                                placeholder="Add Tag"
                                data-analytics-click="settings_edit_profile_skills_btn"
                                disableSubtitle
                            />
                        </div>
                        <Button
                            color="green"
                            className={css.saveBtn}
                            onClick={handleSubmit}
                            isLoading={btnLoading}
                            data-analytics-click="settings_dao_save_btn"
                        >
                            <span>Save</span>
                        </Button>
                    </div>
                </div>
            </React.Suspense>
        </SettingsLayout>
    );
};

export default Profile;
