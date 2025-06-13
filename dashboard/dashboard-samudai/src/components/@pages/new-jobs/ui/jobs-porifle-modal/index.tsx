import React, { useMemo, useState } from 'react';
import { useApplicants } from '../../libs/hooks';
import { JobsSkills } from '../jobs-skills';
import { OpportunityResponse, Applicant, JobsEnums } from '@samudai_xyz/gateway-consumer-types';
import { ProfileDaoItem } from 'components/@pages/new-profile';
import Popup from 'components/@popups/components/Popup/Popup';
import { deserialize } from 'components/editor';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import TextArea from 'ui/@form/TextArea/TextArea';
import { getRawText } from 'utils/utils';
import { ChatIcon } from '../icons';
import css from './jobs-profile-modal.module.scss';
import { useNavigate } from 'react-router-dom';

interface JobsProfileModalProps {
    jobData: OpportunityResponse;
    data: Applicant;
    onClose: () => void;
    onChatClick?: () => void;
}

export const JobsProfileModal: React.FC<JobsProfileModalProps> = ({
    onClose,
    jobData,
    data,
    onChatClick,
}) => {
    const [btnLoading, setBtnLoading] = useState(false);

    const { acceptApplicant, rejectApplicant } = useApplicants();
    const navigate = useNavigate();

    const member = data?.member_details;

    const socials = useMemo(() => {
        const obj: Record<string, string> = {};

        if (!data?.member_details?.socials) return obj;

        return data?.member_details?.socials.reduce((acc, item) => {
            // if(item.url) {
            //     acc[item.type] = item.url;
            // }
            acc[item.type] = item.url;
            return acc;
        }, obj);
    }, [data]);

    const handleSelect = () => {
        setBtnLoading(true);
        acceptApplicant({
            jobData: jobData,
            member_id: data.member_id,
            applicant_id: data.applicant_id,
        })
            .then(() => onClose())
            .finally(() => setBtnLoading(false));
    };

    const handleReject = () => {
        setBtnLoading(true);
        rejectApplicant({
            jobData: jobData,
            member_id: data.member_id,
            applicant_id: data.applicant_id,
        })
            .then(() => onClose())
            .finally(() => setBtnLoading(false));
    };

    return (
        <Popup className={css.profile}>
            <div className={css.head}>
                <h4 className={css.head_title}>CANDIDATE</h4>
                <CloseButton onClick={onClose} />
            </div>

            <div className={css.user}>
                <div
                    className={css.user_img}
                    onClick={() => navigate(`/${member?.member_id}/profile`)}
                >
                    <img
                        src={member?.profile_picture || '/img/icons/user-4.png'}
                        alt="user"
                        className="img-cover"
                    />
                </div>

                <div className={css.user_content}>
                    <h3
                        className={css.user_name}
                        onClick={() => navigate(`/${member?.member_id}/profile`)}
                    >
                        {member?.name}
                    </h3>
                    <p className={css.user_position}>{member?.present_role}</p>
                </div>

                <button className={css.user_messageBtn} onClick={onChatClick}>
                    <ChatIcon />
                </button>
            </div>

            <div className={css.skills}>
                <h3 className={css.subtitle}>Skills</h3>
                {(member?.skills || []).length > 0 ? (
                    <JobsSkills values={member?.skills || []} onChange={() => {}} readOnly />
                ) : (
                    <p className={css.empty}>No Skills Mentioned</p>
                )}
            </div>

            {/* <div className={css.socials}>
                <h4 className={css.profile_title}>Portfolio</h4>
                {Object.keys(socials).length > 0 ? (
                    <ProfileSocials {...socials} />
                ) : (
                    <p className={css.empty}>No Porfolio Links Mentioned</p>
                )}
            </div> */}

            <div className={css.message}>
                <h4 className={css.profile_title}>Messsage from the Contributor</h4>
                <TextArea
                    value={getRawText(deserialize(data.application))}
                    onChange={() => {}}
                    className={css.message_input}
                    readOnly
                />
            </div>

            <div className={css.worked}>
                <h4 className={css.subtitle}>DAOs worked with</h4>
                {!member?.dao_worked_with.length ? (
                    <p className={css.empty}>Hasn't worked with any DAO currently.</p>
                ) : (
                    <ul className={css.worked_list}>
                        {member?.dao_worked_with.map((item, index) => (
                            <li className={css.worked_item} key={index}>
                                <ProfileDaoItem data={item} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {data.status !== JobsEnums.ApplicantStatusType.APPLIED && (
                <div className={css.apply_status_controls}>
                    <div
                        className={css.apply_status}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        data-status={data.status.toLowerCase()}
                    >
                        <span>{data.status}</span>
                    </div>
                </div>
            )}

            {data.status === JobsEnums.ApplicantStatusType.APPLIED && (
                <div className={css.controls}>
                    <Button
                        className={css.controls_rejectBtn}
                        color="transparent"
                        onClick={handleReject}
                        isLoading={btnLoading}
                    >
                        <span>Reject</span>
                    </Button>
                    <Button
                        className={css.controls_btn}
                        color="green"
                        onClick={handleSelect}
                        isLoading={btnLoading}
                    >
                        <span>Accept</span>
                    </Button>
                </div>
            )}
        </Popup>
    );
};
