import React from 'react';
import { ActivityEnums, MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import usePopup from 'hooks/usePopup';
import { DaoTags, IconsList, getDiscoveryStatus } from 'components/@pages/new-discovery';
import { JobsChat } from 'components/@pages/new-jobs';
import { useFetchProfileDaos } from 'components/@pages/new-profile';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import discoveryCss from '../../../new-discovery/ui/discovery-card/discovery-card.module.scss';
import css from './connections-item.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector, useTypedDispatch } from 'hooks/useStore';
import { selectContributorProgress, changeContributorProgress } from 'store/features/common/slice';
import { useUpdateContributorProgressMutation } from 'store/services/userProfile/userProfile';
import { getMemberId } from 'utils/utils';

interface ConnectionsItemProps {
    data: MemberResponse;
    setData?: (data: MemberResponse[]) => void;
    status?: string;
    text?: string;
    pending?: boolean;
}

export const ConnectionsItem: React.FC<ConnectionsItemProps> = ({
    data,
    setData,
    pending,
    status,
    text,
}) => {
    const statusData = status ? getDiscoveryStatus(status) : null;
    const { acceptConnection, memberRequests } = useFetchProfileDaos();
    const assigneesState = usePopup<{
        member: IMember;
    }>();
    const navigate = useNavigate();
    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const dispatch = useTypedDispatch();

    const [updateContributorProgress] = useUpdateContributorProgressMutation();

    const handleAccept = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        const oldData = [...memberRequests];
        setData?.([...memberRequests.filter((member) => member.member_id !== data.member_id)]);
        acceptConnection(data.member_id)
            .then(() => {
                if (!currContributorProgress.accept_pending_requests)
                    updateContributorProgress({
                        memberId: getMemberId(),
                        itemId: [ActivityEnums.NewContributorItems.ACCEPT_PENDING_REQUESTS],
                    }).then(() => {
                        dispatch(
                            changeContributorProgress({
                                contributorProgress: {
                                    ...currContributorProgress,
                                    accept_pending_requests: true,
                                },
                            })
                        );
                    });
            })
            .catch(() => {
                setData?.(oldData);
            });
    };

    return (
        <div
            className={`${discoveryCss.container} ${statusData?.className}`}
            data-analytics-parent="looking-to-collaborate-parent"
        >
            <div
                className={css.root}
                onClick={() => navigate(`/${data.member_id}/profile`)}
                style={{ cursor: 'pointer' }}
            >
                <div className={css.head}>
                    <div className={css.head_img}>
                        <img
                            className="img-cover"
                            src={data.profile_picture || '/img/icons/user-5.png'}
                            alt="dao"
                        />
                    </div>

                    <div className={css.head_content}>
                        <div style={{ height: '35px' }}>
                            {statusData && (
                                <p
                                    className={`${discoveryCss.head_status} ${statusData.className}`}
                                >
                                    {statusData.icon} <span>{statusData.name}</span>
                                </p>
                            )}
                        </div>
                        <div className={css.head_name}>{data.name || ''}</div>
                        {data.open_for_opportunity && (
                            <button
                                className={css.head_btn}
                                data-analytics-click="looking_to_collaborate_button"
                            >
                                <Sprite url="/img/sprite.svg#user-tick" />
                                <span>Looking to Collaborate</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className={css.tags}>
                    <DaoTags tags={data.skills} />

                    {text && (
                        <div className={css.text}>
                            <sup>PERSONAL MESSAGE</sup>
                            <p>{text}</p>
                        </div>
                    )}
                </div>

                <div className={css.footer}>
                    <div className={css.footer_left}>
                        <p className={css.footer_name}>Previous DAOs</p>

                        <IconsList
                            className={css.footer_members}
                            values={data.dao_worked_profile_pictures || []}
                            length={data.dao_worked_count}
                            maxShow={4}
                            size={36}
                        />
                    </div>

                    {pending && (
                        <Button
                            className={css.connectBtn}
                            color="green"
                            onClick={handleAccept}
                            data-analytics-click="accept_collaboration_button"
                        >
                            <span>Accept</span>
                        </Button>
                    )}

                    {!pending && (
                        <div className={css.footer_right}>
                            <button
                                className={css.footer_msgBtn}
                                onClick={(e) => {
                                    assigneesState.open({
                                        member: {
                                            member_id: data?.member_id || '',
                                            username: data?.username || '',
                                            profile_picture: data?.profile_picture,
                                            name: data?.name,
                                        },
                                    });
                                    e.stopPropagation();
                                }}
                            >
                                <Sprite url="/img/sprite.svg#message" />
                            </button>

                            {/* <SettingsDropdown
                                className={css.footer_settings}
                                button={
                                    <Sprite
                                        url="/img/sprite.svg#dots"
                                        className={css.settingsSvg}
                                    />
                                }
                            >
                                <SettingsDropdown.Item>Option 1</SettingsDropdown.Item>
                                <SettingsDropdown.Item>Option 2</SettingsDropdown.Item>
                                <SettingsDropdown.Item>Option 3</SettingsDropdown.Item>
                            </SettingsDropdown> */}
                        </div>
                    )}
                </div>
            </div>
            {assigneesState.payload && (
                <PopupBox
                    active={assigneesState.active}
                    onClose={assigneesState.close}
                    effect="side"
                    children={
                        <JobsChat
                            member={assigneesState.payload.member}
                            onClose={assigneesState.close}
                        />
                    }
                />
            )}
        </div>
    );
};
