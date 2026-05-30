import React, { useEffect, useMemo, useState } from 'react';
import { ActivityEnums, MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import {
    changeContributorProgress,
    changeProfilePicture,
    selectContributorProgress,
    selectMemberConnections,
    setMemberData,
} from 'store/features/common/slice';
import { useLazyCheckUserNameQuery, useUpdateProfilePicMutation } from 'store/services/Login/login';
import { getMemberByIdResponse } from 'store/services/userProfile/model';
import {
    useGetMemberByIdMutation,
    useUpdateContributorProgressMutation,
    useUpdateMemberMutation,
} from 'store/services/userProfile/userProfile';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import EditProfileSkills from 'components/@pages/profile/popups/EditProfileSkills';
import PorfolioLinks, { FormDataLinksType } from 'components/@pages/profile/popups/PorfolioLinks';
import ProfilePicture from 'components/@pages/profile/popups/ProfilePicture';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Select from 'ui/@form/Select/Select';
import TextArea from 'ui/@form/TextArea/TextArea';
import Switch from 'ui/Switch/Switch';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from 'scss/pages/settings-profile.module.scss';
import {
    useGetContributorDomainTagsQuery,
    useGetContributorSkillsQuery,
} from 'store/services/Discovery/Discovery';
import { ClaimSubdomainModal } from 'components/@pages/new-onboarding';

interface ProfileProps {}

interface FormDataType {
    name: string;
    username: string;
    links: FormDataLinksType;
    skills: string[];
    avatar: File | null;
    NFT: string | null;
    bio: string;
    present_role: string;
    open_for_opportunity: boolean;
    domain_tags_for_work: string[];
    hourly_rate: string;
}

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

const Profile: React.FC<ProfileProps> = () => {
    const memberId = getMemberId();
    const [isValid, setIsValid] = useState<boolean>(true);
    const [load, setLoad] = useState<boolean>(true);
    const [defaultUserName, setDefaultUserName] = useState<string>('');
    const [picUrl, setPicUrl] = useState<string>('');
    const [data, setData] = useState<MemberResponse>();
    const dispatch = useTypedDispatch();
    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const trialDashboard = useTypedSelector(selectTrialDashboard);
    const discordModal = usePopup();
    const connections = useTypedSelector(selectMemberConnections);

    const [userLinks, setUserLinks] = useState(getDefaultLinks());
    const [subDomain, setSubDomain] = useState<string>('');
    const [btnLoading, setBtnLoading] = useState(false);
    const subdomainModal = usePopup<{
        type: 'dao' | 'contributor';
    }>();

    const [getMemberDetails, { data: memberData }] = useGetMemberByIdMutation({
        fixedCacheKey: memberId,
    });
    const { data: allSkills } = useGetContributorSkillsQuery();
    const { data: allDomainTags } = useGetContributorDomainTagsQuery();
    const [updateContributorProgress] = useUpdateContributorProgressMutation();
    const [uploadProfilePic] = useUpdateProfilePicMutation();
    const [memberUpdate] = useUpdateMemberMutation();
    const [checkUserName] = useLazyCheckUserNameQuery();

    interface IData {
        id: number;
        img: string;
    }

    const order = {
        behance: {
            placeholder: 'https://www.behance.net/username',
            checkValue: 'https://www.behance.net/',
        },
        twitter: {
            placeholder: 'https://twitter.com/username',
            checkValue: 'https://twitter.com/',
        },
        dribbble: {
            placeholder: 'https://dribbble.com/username',
            checkValue: 'https://dribbble.com/',
        },
        fiverr: {
            placeholder: 'https://fiverr.com/username',
            checkValue: 'https://fiverr.com/',
        },
        github: {
            placeholder: 'https://github.com/username',
            checkValue: 'https://github.com/',
        },
        linkedIn: {
            placeholder: 'https://linkedin.com/username',
            checkValue: 'https://linkedin.com/',
        },
        mirror: {
            placeholder: 'https://mirror.xyz/username',
            checkValue: 'https://mirror.xyz/',
        },
    };

    const [formData, setFormData] = useState<FormDataType>({
        NFT: null,
        name: '',
        username: '',
        skills: [],
        avatar: null,
        links: getDefaultLinks(),
        bio: '',
        present_role: '',
        open_for_opportunity: false,
        domain_tags_for_work: [],
        hourly_rate: '',
    });

    const AfterFetch = (res: getMemberByIdResponse) => {
        setData(res?.data?.member);
        setDefaultUserName(res.data?.member?.username || '');
        const socials = getDefaultLinks();
        res.data?.socials?.forEach(
            (val: any) => (socials[val.type as keyof FormDataLinksType] = val.url)
        );
        setSubDomain(res.data?.member?.subdomain || '');
        const member = res?.data?.member;
        console.log(member);
        const data: FormDataType = {
            name: member?.name || '',
            username: member?.username || '',
            skills: member?.skills || [],
            avatar: null,
            NFT: null,
            links: socials,
            bio: member?.about || '',
            present_role: member?.present_role || '',
            open_for_opportunity: member?.open_for_opportunity || false,
            domain_tags_for_work: member?.domain_tags_for_work || [],
            hourly_rate: member?.hourly_rate || '',
        };
        setFormData(data);
        setUserLinks(socials);
    };

    useEffect(() => {
        const fun = async () => {
            try {
                if (memberData) {
                    AfterFetch(memberData);
                } else {
                    getMemberDetails({
                        member: { type: 'member_id', value: memberId },
                    })
                        .unwrap()
                        .then((res) => {
                            AfterFetch(res);
                        });
                }
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            }
        };
        fun();
    }, []);

    const isClaimSubdomainActive = useMemo(() => {
        return Object.entries(currContributorProgress).every(
            ([key, value]) =>
                key === ActivityEnums.NewContributorItems.CLAIM_SUBDOMAIN ||
                key === ActivityEnums.NewContributorItems.CLAIM_NFT ||
                value === true
        );
    }, [currContributorProgress]);

    const handleChange = (name: keyof Omit<FormDataType, 'links'>) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (name === 'username') {
                checkUserName(e.target.value.trim().toLowerCase())
                    .unwrap()
                    .then((res) => {
                        setFormData({ ...formData, [name]: e.target.value });
                        if (!res.data?.exist) setIsValid(true);
                        else if (defaultUserName === e.target.value.toLowerCase()) setIsValid(true);
                        else setIsValid(false);
                    });
            }

            setFormData({ ...formData, [name]: e.target.value });
        };
    };

    const hasNonEmptyStringValue = (links: FormDataLinksType) => {
        const values = Object.values(links);
        return values.some((value) => typeof value === 'string' && value.trim() !== '');
    };

    const handleSave = async () => {
        if (trialDashboard) {
            return discordModal.open();
        }
        if (!formData.name.trim()) return toast('Failure', 5000, 'Name is required', '')();
        if (formData.name.trim()) {
            const regex = new RegExp('^(?=.{2,20}$)[a-zA-Z]+(?: [a-zA-Z]+)?$');
            // if (!regex.test(formData.name.trim().toLowerCase()))
            //Will allow all unicode values
            if (!formData.name.trim().normalize)
                return toast('Failure', 5000, 'Please Enter a Valid Name', '')();
        }
        if (!formData.username.trim()) return toast('Failure', 5000, 'Username is required', '')();
        const regex = new RegExp('^(?=[a-z0-9._]{3,18}$)(?!.*[_.]{2})[^_.].*[^_.]$');
        if (!regex.test(formData.username.trim().toLowerCase()))
            return toast('Failure', 5000, 'Please Enter a Valid Username', '')();
        if (!formData.bio) return toast('Failure', 5000, 'Bio is required', '')();
        if (!hasNonEmptyStringValue(formData.links))
            return toast('Failure', 5000, 'Atleast 1 portfolio link is required', '')();
        if (!formData.skills.length) return toast('Failure', 5000, 'Skills are required', '')();
        if (!!formData.open_for_opportunity && !formData.domain_tags_for_work.length)
            return toast('Failure', 5000, 'Domain tags are required', '')();
        if (!!formData.hourly_rate && !+formData.hourly_rate)
            return toast('Failure', 5000, 'Please enter valid hourly rate', '')();
        setBtnLoading(true);
        try {
            setLoad(false);
            if (formData.avatar) {
                const member_id = getMemberId();
                const imageData = new FormData();
                imageData.append('file', formData.avatar!);
                imageData.append('memberId', member_id);
                imageData.append('typeOfProfilePicture', formData.NFT ? '1' : '0');
                imageData.append('nftProfilePicture', formData.NFT ? formData.NFT : '');
                uploadProfilePic(imageData)
                    .unwrap()
                    .then((res) => {
                        console.log(res);
                        setPicUrl(res?.data ? res?.data : picUrl);
                        dispatch(
                            changeProfilePicture({
                                profilePicture: res?.data ? res?.data : picUrl,
                            })
                        );
                    })
                    .catch((err) => {
                        setLoad(true);
                        toast('Failure', 5000, 'Profile Picture update failed', '')();
                    });
            }

            const payload = {
                member: {
                    ...data,
                    member_id: getMemberId(),
                    username: formData.username.toLowerCase().trim(),
                    did: data?.did || '',
                    open_for_opportunity: formData?.open_for_opportunity,
                    captain: data?.captain || false,
                    name: formData.name,
                    email: data?.email || '',
                    about: formData?.bio,
                    skills: formData?.skills,
                    profile_picture: picUrl || data?.profile_picture || '',
                    ceramin_stream: data?.ceramic_stream || '',
                    present_role: formData?.present_role,
                    domain_tags_for_work: formData?.domain_tags_for_work,
                    hourly_rate: !formData?.hourly_rate
                        ? undefined
                        : String(+formData?.hourly_rate),
                    currency: data?.currency || 'USDT',
                },
                socials: [
                    {
                        member_id: getMemberId(),
                        type: 'twitter',
                        url: formData.links.twitter,
                    },
                    {
                        member_id: getMemberId(),
                        type: 'behance',
                        url: formData.links.behance,
                    },
                    {
                        member_id: getMemberId(),
                        type: 'dribbble',
                        url: formData.links.dribbble,
                    },
                    {
                        member_id: getMemberId(),
                        type: 'mirror',
                        url: formData.links.mirror,
                    },
                    {
                        member_id: getMemberId(),
                        type: 'linkedIn',
                        url: formData.links.linkedIn!,
                    },
                    {
                        member_id: getMemberId(),
                        type: 'fiverr',
                        url: formData.links.fiverr!,
                    },
                    {
                        member_id: getMemberId(),
                        type: 'github',
                        url: formData.links.github!,
                    },
                ],
            };

            const res = await memberUpdate(payload).unwrap();
            setLoad(true);
            const member = await getMemberDetails({
                member: { type: 'member_id', value: memberId },
            }).unwrap();
            dispatch(setMemberData({ member: member.data!.member, connections: connections! }));
            toast('Success', 5000, 'Updated Successfuly', '')();
            if (
                (!currContributorProgress.open_to_work && formData?.open_for_opportunity) ||
                (!currContributorProgress.add_techstack && formData?.skills.length > 0) ||
                (!currContributorProgress.add_hourly_rate && formData?.hourly_rate)
            ) {
                const newItemIds = [];

                if (!currContributorProgress.open_to_work && formData?.open_for_opportunity) {
                    newItemIds.push(ActivityEnums.NewContributorItems.OPEN_TO_WORK);
                }

                if (!currContributorProgress.add_techstack && formData?.skills.length) {
                    newItemIds.push(ActivityEnums.NewContributorItems.ADD_TECHSTACK);
                }

                if (!currContributorProgress.add_hourly_rate && formData?.hourly_rate) {
                    newItemIds.push(ActivityEnums.NewContributorItems.ADD_HOURLY_RATE);
                }

                updateContributorProgress({
                    memberId: getMemberId(),
                    itemId: newItemIds,
                }).then(() => {
                    const newProgress: any = {
                        open_to_work:
                            (!currContributorProgress.open_to_work &&
                                formData?.open_for_opportunity) ||
                            currContributorProgress.open_to_work,
                        add_techstack:
                            (!currContributorProgress.add_techstack &&
                                formData?.skills.length > 0) ||
                            currContributorProgress.add_techstack,
                        add_hourly_rate:
                            (!currContributorProgress.add_hourly_rate && formData?.hourly_rate) ||
                            currContributorProgress.add_hourly_rate,
                    };

                    dispatch(
                        changeContributorProgress({
                            contributorProgress: {
                                ...currContributorProgress,
                                ...newProgress,
                            },
                        })
                    );
                });
            }
        } catch (err: any) {
            setLoad(true);
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        } finally {
            setBtnLoading(false);
        }
    };

    const handleLinks = (name: keyof FormDataLinksType) => {
        return (value: string) => {
            setFormData({ ...formData, links: { ...formData.links, [name]: value } });
        };
    };

    const handleAddSkill = (skill: string) => {
        setFormData({ ...formData, skills: [...formData.skills, skill] });
    };

    const handleRemoveSkill = (skill: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    const handleAddJobTags = (tag: string) => {
        setFormData({ ...formData, domain_tags_for_work: [...formData.domain_tags_for_work, tag] });
    };

    const handleRemoveJobTags = (tag: string) => {
        setFormData({
            ...formData,
            domain_tags_for_work: formData.domain_tags_for_work.filter((s) => s !== tag),
        });
    };

    const handleAvatar = (file: File) => {
        if (file!.size > 1500000) {
            toast('Failure', 5000, 'Please Select an Image less than 1.5MB', '')();
            return;
        }
        setFormData({ ...formData, avatar: file, NFT: null });
    };

    const handleNFT = (file: string) => {
        setPicUrl(file);
        setFormData({ ...formData, NFT: file, avatar: null });
    };

    return (
        <div
            className={css.main}
            data-analytics-page="settings_contributor_profile"
            data-analytics-parent="profile_settings"
        >
            <div className={css.root}>
                <div className={css.item} id="about">
                    <ProfilePicture
                        className={css.avatar}
                        avatar={formData.avatar || formData.NFT}
                        onChange={handleAvatar}
                        handleNFT={handleNFT}
                    />
                </div>

                <div className={css.item}>
                    <div className={css.inputWrapper}>
                        <h3 className={css.inputTitle}>Name*</h3>
                        <Input
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            className={css.input}
                            data-analytics-click="name_input"
                        />
                    </div>
                </div>

                <div className={css.item}>
                    <div className={css.inputWrapper}>
                        <h3 className={css.inputTitle}>Username*</h3>
                        <Input
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange('username')}
                            className={css.input}
                            error={!isValid && 'Please enter a different username'}
                            data-analytics-click="username_input"
                        />
                    </div>
                </div>

                <div className={css.item}>
                    <div className={css.inputWrapper}>
                        <h3 className={css.inputTitle}>Present Role</h3>
                        <Input
                            placeholder="Senior Frontend Developer"
                            value={formData.present_role}
                            onChange={handleChange('present_role')}
                            className={css.input}
                            data-analytics-click="present_role_input"
                        />
                    </div>
                </div>

                <div className={css.item}>
                    <div className={css.inputWrapper}>
                        <h3 className={css.inputTitle}>
                            <span>Bio*</span>
                            <span data-gray>(120 characters)</span>
                        </h3>
                        <TextArea
                            placeholder="Tell something about you to community"
                            value={formData.bio}
                            onChange={(ev) => setFormData({ ...formData, bio: ev.target.value })}
                            className={css.textarea}
                            data-analytics-click="bio_input"
                        />
                    </div>
                </div>

                <div className={css.item}>
                    <div className={css.inputWrapper}>
                        <h3 className={css.inputTitle}>Subdomain</h3>
                        <p className={css.subdomain} style={{ color: '#b2ffc3' }}>
                            {subDomain === null || subDomain === '' ? (
                                <button
                                    style={{
                                        color: !isClaimSubdomainActive ? '#52585E' : '#b2ffc3',
                                        fontWeight: '500',
                                        lineHeight: '20px',
                                        textDecorationLine: 'underline',
                                    }}
                                    onClick={() => {
                                        if (!isClaimSubdomainActive) {
                                            toast(
                                                'Failure',
                                                5000,
                                                'Complete your progress bar to unlock subdomain claim',
                                                ''
                                            )();
                                        } else {
                                            subdomainModal.open({ type: 'contributor' });
                                        }
                                    }}
                                >
                                    Claim Subdomain
                                </button>
                            ) : (
                                <a
                                    href={'https://' + subDomain + '.samudai.eth.limo'}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {subDomain}.samudai.eth
                                </a>
                            )}
                        </p>
                    </div>
                </div>

                <div className={css.item} id="links">
                    <h3 className={css.inputTitle}>
                        Portfolio links* <strong>(atleast 1)</strong>
                    </h3>
                    <PorfolioLinks
                        className={css.portfolioLinks}
                        links={formData.links}
                        filledLinks={userLinks}
                        onChange={handleLinks}
                    />
                </div>

                <div className={css.item} id="skills">
                    <EditProfileSkills
                        title="Add new skills*"
                        subtitle="Your Skills"
                        className={css.skills}
                        skills={formData.skills}
                        hints={allSkills?.data?.skills || []}
                        onAddSkill={handleAddSkill}
                        onRemoveSkill={handleRemoveSkill}
                        placeholder="Development, Designing etc"
                        data-analytics-click="settings_edit_profile_skills_btn"
                        disableSubtitle
                    />
                </div>

                <div className={css.item}>
                    <div className={css.openFor}>
                        <h3 className={css.openFor_title}>Open for Jobs</h3>
                        <Switch
                            className={css.openFor_switch}
                            active={formData.open_for_opportunity}
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    open_for_opportunity: !formData.open_for_opportunity,
                                })
                            }
                            data-analytics-click="switch_open_for_opportunity_btn"
                        />
                    </div>
                </div>

                {formData.open_for_opportunity && (
                    <div className={css.item}>
                        <EditProfileSkills
                            title="Domains you’re open to work*"
                            subtitle="Domains you’re open to work"
                            skills={formData.domain_tags_for_work}
                            hints={allDomainTags?.data?.domainTags || []}
                            onAddSkill={handleAddJobTags}
                            onRemoveSkill={handleRemoveJobTags}
                            placeholder="Development, Designing etc"
                            disableSubtitle
                        />
                    </div>
                )}

                <div className={css.item} id="rate" data-analytics-parent="select_rate_parent">
                    <h3 className={css.itemTitle}>Hourly Rate</h3>

                    <div className={css.rate}>
                        <Select className={css.rate_select} closeClickOuside>
                            <Select.Button className={css.rate_select_btn} disabled arrow>
                                USDT
                            </Select.Button>

                            <Select.List className={css.rate_select_list}>
                                <Select.Item className={css.rate_select_item}>BNB</Select.Item>
                                <Select.Item className={css.rate_select_item}>BUSD</Select.Item>
                                <Select.Item className={css.rate_select_item}>ETH</Select.Item>
                            </Select.List>
                        </Select>

                        <Input
                            className={css.rate_input}
                            placeholder="Amount"
                            value={formData.hourly_rate || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, hourly_rate: e.target.value })
                            }
                            data-analytics-click="amount_input"
                        />
                    </div>
                </div>

                <Button
                    color="green"
                    className={css.saveBtn}
                    onClick={handleSave}
                    isLoading={btnLoading}
                    data-analytics-click="save_button"
                >
                    <span>Save</span>
                </Button>
            </div>
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
            <PopupBox
                active={subdomainModal.active}
                onClose={subdomainModal.close}
                children={
                    <ClaimSubdomainModal
                        type={subdomainModal.payload?.type}
                        onClose={subdomainModal.close}
                    />
                }
            />
        </div>
    );
};

export default Profile;
