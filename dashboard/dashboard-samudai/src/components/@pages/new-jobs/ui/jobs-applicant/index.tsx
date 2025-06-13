import React from 'react';
import { JobsChat } from '../jobs-chat';
import { JobsTags } from '../jobs-tags';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import { getMemberId } from 'utils/utils';
import { ChatIcon } from '../icons';
import css from './jobs-applicant.module.scss';

interface JobsApplicantProps {
    data?: MemberResponse;
    onViewProfile?: () => void;
    onSubmission?: () => void;
    onChatClick?: () => void;
}

export const JobsApplicant: React.FC<JobsApplicantProps> = ({
    data,
    onViewProfile,
    onSubmission,
    onChatClick,
}) => {
    const assigneesState = usePopup<{
        member: IMember;
    }>();

    const memberId = getMemberId();

    return (
        <div className={css.applicant}>
            <div className={css.user}>
                <div className={css.user_image}>
                    <img
                        src={data?.profile_picture || '/img/icons/user-4.png'}
                        className="img-cover"
                        alt="avatar"
                    />
                </div>
                <div className={css.user_content}>
                    <h4 className={css.user_name}>{data?.name}</h4>
                    {/* <h4 className={css.user_position}>Product Designer</h4>
                    <h4 className={css.user_location}>Dubai, UAE</h4> */}
                </div>
            </div>

            <div className={css.tags}>
                <JobsTags tags={data?.skills || []} />
            </div>

            <div className={css.controls}>
                {onViewProfile && (
                    <Button
                        className={css.controls_viewProfileBtn}
                        onClick={() => onViewProfile()}
                        color="green"
                    >
                        <span>View Profile</span>
                    </Button>
                )}
                {onSubmission && (
                    <Button
                        className={css.controls_viewProfileBtn}
                        onClick={() => onSubmission()}
                        color="green"
                    >
                        <span>View Submission</span>
                    </Button>
                )}
                {memberId !== data?.member_id && (
                    <button className={css.controls_chatBtn} onClick={onChatClick}>
                        <ChatIcon />
                    </button>
                )}
            </div>
            {assigneesState.payload?.member && (
                <PopupBox
                    active={assigneesState.active}
                    onClose={assigneesState.close}
                    effect="side"
                >
                    <JobsChat member={assigneesState.payload.member} />
                </PopupBox>
            )}
        </div>
    );
};
