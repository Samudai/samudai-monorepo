import React, { useState } from 'react';
import dayjs from 'dayjs';
import Popup from 'components/@popups/components/Popup/Popup';
import BackButton from 'components/@signup/elements/BackButton/BackButton';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import TextArea from 'ui/@form/TextArea/TextArea';
import { LinkIcon } from '../icons';
import css from './jobs-submission-modal.module.scss';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import { BountyResponse, JobsEnums, Submission } from '@samudai_xyz/gateway-consumer-types';
import { useSubmissions } from '../../libs/hooks';
import { indexes } from 'components/@pages/projects/ui/projects-post-job/components/job-card';
import sideBarCss from 'components/new-sidebar/ui/sidebar-daos/sidebar-daos.module.scss';
import { ensureHttpsProtocol, getInitial } from 'utils/utils';
import clsx from 'clsx';
import { Editor, deserialize } from 'components/editor';
import sendNotification from 'utils/notification/sendNotification';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { getMemberId } from 'utils/utils';
import { useNavigate } from 'react-router-dom';

interface JobsSubmissionModalProps {
    bountyId: string;
    data: Submission;
    bounty?: BountyResponse;
    onClose: () => void;
}

export const JobsSubmissionModal: React.FC<JobsSubmissionModalProps> = ({
    bountyId,
    data,
    bounty,
    onClose,
}) => {
    const [tab, setTab] = useState<'rejection' | 'award' | 'main'>('main');
    const [rank, setRank] = useState<number>();
    const [description, setDescription] = useState('');
    const member_id = getMemberId();
    const navigate = useNavigate();

    const { acceptSubmission, rejectSubmission } = useSubmissions();

    const handleAward = () => {
        acceptSubmission({
            bounty_id: bountyId,
            member_id: data.member_id!,
            submission_id: data.submission_id,
            rank,
        }).then(() => {
            if (bounty?.dao_id) {
                sendNotification({
                    to: [bounty.dao_id],
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: member_id,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: '',
                        redirect_link: `/${bounty.dao_id}/payments`,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment.INITIATE_PAYMENT,
                });
            }
            onClose();
        });
    };

    const handleReject = () => {
        rejectSubmission({
            bounty_id: bountyId,
            member_id: data.member_id!,
            submission_id: data.submission_id,
            feedback: description,
        }).then(() => onClose());
    };

    return (
        <Popup className={css.submission}>
            <div className={css.head}>
                {tab === 'main' && <h3 className={css.head_title}>SUBMISSION</h3>}
                {tab !== 'main' && (
                    <BackButton
                        onClick={setTab.bind(null, 'main')}
                        className={css.head_backBtn}
                        title="Back to Submission"
                    />
                )}
                <CloseButton onClick={onClose} />
            </div>

            <h3 className={css.title}>{bounty?.title}</h3>

            <p className={css.lastupdated}>
                <span>Posted</span>{' '}
                <strong>{dayjs(bounty?.created_at).format('MMM DD, YYYY')}</strong>
            </p>

            {tab === 'main' && (
                <>
                    <div className={css.submission_item}>
                        <div className={css.submission_row}>
                            <div className={css.submission_col}>
                                <h4 className={css.submission_subtitle}>Attempted By</h4>
                                <div
                                    className={css.profile}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        navigate(`/${data?.member_details?.member_id}/profile`)
                                    }
                                >
                                    <div className={css.profile_image}>
                                        <img
                                            src={
                                                data?.member_details?.profile_picture ||
                                                '/img/icons/user-4.png'
                                            }
                                            alt="user"
                                            className="img-cover"
                                        />
                                    </div>
                                    <p className={css.profile_name}>{data?.member_details?.name}</p>
                                </div>
                            </div>
                            <div className={css.submission_col}>
                                <h4 className={css.submission_subtitle}>DAO</h4>
                                <div className={css.profile}>
                                    <span className={clsx(sideBarCss.daos_logo, css.profile_image)}>
                                        <span>{getInitial(bounty?.dao_name || '')}</span>
                                    </span>
                                    <p className={css.profile_name}>{bounty?.dao_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={css.submission_item}>
                        <h4 className={css.submission_subtitle}>Link to the Project</h4>
                        <a
                            className={css.link}
                            href={data?.file && ensureHttpsProtocol(data?.file)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span>{data?.file}</span>
                            <LinkIcon />
                        </a>
                    </div>
                </>
            )}

            {tab !== 'award' && (
                <div className={css.submission_item}>
                    <h4 className={css.submission_subtitle}>Description</h4>
                    <Editor
                        readOnly
                        className={css.description}
                        value={deserialize(data.submission)}
                    />
                </div>
            )}

            {tab === 'rejection' && (
                <div className={css.submission_item}>
                    <h4 className={css.submission_subtitle}>Reason for Rejection</h4>
                    <TextArea
                        value={description}
                        onChange={(ev) => setDescription(ev.target.value)}
                        className={css.textarea}
                        placeholder="Enter your text"
                    />
                </div>
            )}

            {tab === 'award' && (
                <div className={css.submission_item}>
                    <h4 className={css.submission_subtitle}>Award Position</h4>
                    <ul className={css.position}>
                        {bounty?.payout?.map((payout, index) => (
                            <li
                                key={payout.payout_id}
                                className={css.position_item}
                                onClick={() => setRank(index + 1)}
                            >
                                <span>{indexes[index]} Position</span>
                                <span>
                                    {payout.payout_currency.name} {payout.payout_amount}
                                </span>
                                <Checkbox
                                    className={css.position_checkbox}
                                    active={rank === index + 1}
                                />
                            </li>
                        ))}
                        {/* <li className={css.position_item}>
                            <span>First Position</span>
                            <span>USDT 1000</span>
                            <Checkbox className={css.position_checkbox} active={false} />
                        </li>
                        <li className={css.position_item}>
                            <span>Second Position</span>
                            <span>USDT 800</span>
                            <Checkbox className={css.position_checkbox} active={false} />
                        </li>
                        <li className={css.position_item}>
                            <span>Third Position</span>
                            <span>USDT 500</span>
                            <Checkbox className={css.position_checkbox} active={false} />
                        </li> */}
                    </ul>
                </div>
            )}

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
                    {tab === 'main' && (
                        <>
                            <Button
                                className={css.controls_rejectBtn}
                                onClick={setTab.bind(null, 'rejection')}
                                color="transparent"
                            >
                                <span>Reject</span>
                            </Button>
                            <Button
                                className={css.controls_btn}
                                onClick={setTab.bind(null, 'award')}
                                color="green"
                            >
                                <span>Award</span>
                            </Button>
                        </>
                    )}

                    {tab === 'award' && (
                        <Button className={css.controls_btn} color="green" onClick={handleAward}>
                            <span>Confirm Award</span>
                        </Button>
                    )}

                    {tab === 'rejection' && (
                        <Button className={css.controls_btn} color="green" onClick={handleReject}>
                            <span>Confirm Rejection</span>
                        </Button>
                    )}
                </div>
            )}
        </Popup>
    );
};
