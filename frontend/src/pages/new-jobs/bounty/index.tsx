import React, { useCallback, useEffect, useState } from 'react';
import { JobsEnums, Submission } from '@samudai_xyz/gateway-consumer-types';
import usePopup from 'hooks/usePopup';
import css from 'pages/new-jobs/jobs.module.scss';
import {
    JobsAddModal,
    JobsCard,
    JobsHeader,
    useBounty,
    useFavourites,
    useSubmissions,
} from 'components/@pages/new-jobs';
import { JobsViewModal } from 'components/@pages/new-jobs/ui/jobs-view-modal';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import { getMemberId } from 'utils/utils';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { useTypedSelector } from 'hooks/useStore';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import { useJobsFilter } from 'components/@pages/new-jobs/libs/hooks/use-jobs-filter';

const Bounty: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const { filter, setFilter } = useJobsFilter();
    const { archiveBounty, getFilteredList, removeBounty } = useBounty();
    const { FavouriteBounty, favBountyList, DeleteBounty } = useFavourites();
    const {
        submissions: newSubmissions,
        isLoading,
        getSubmissionsForMember,
    } = useSubmissions(true);
    const memberId = getMemberId();

    const addModal = usePopup();
    const editModal = usePopup<{
        data: any;
    }>();
    const viewModal = usePopup<{
        data: any;
        apply_tab: boolean;
        type: 'task' | 'bounty';
        status?: JobsEnums.ApplicantStatusType;
    }>();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const fetchSubmissions = () => {
        getSubmissionsForMember(memberId).then((res) => setSubmissions(res));
    };

    useEffect(() => {
        if (newSubmissions?.length) {
            setSubmissions(newSubmissions);
        }
    }, [newSubmissions]);

    useEffect(() => {
        if (memberId) {
            fetchSubmissions();
        }
    }, [memberId]);

    const getSubmissionDetails = useCallback(
        (bountyId: string) => {
            return submissions.find((submission) => submission.bounty_id === bountyId);
        },
        [submissions]
    );

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={css.jobs} data-analytics-page="jobs_bounty">
            <JobsHeader
                breadcrumbs={[{ name: 'Bounty', disabled: true }]}
                currentLink="Bounty"
                title="Bounty"
                onCreator={() => {
                    if (trialDashboard) discordModal.open();
                    else addModal.open();
                }}
                filter={filter}
                setFilter={setFilter}
            />

            <div className="container">
                <ul className={css.jobs_list}>
                    {getFilteredList(filter).map((bounty) => (
                        <li className={css.jobs_item} key={bounty.bounty_id}>
                            <JobsCard
                                type="bounty"
                                title={bounty.title}
                                projectName={bounty?.project_name}
                                daoName={bounty?.dao_name}
                                daoId={bounty.dao_id}
                                reviewer={bounty.poc_member}
                                payout={bounty.payout?.map((payout) => {
                                    return {
                                        currency: payout.payout_currency,
                                        value: payout.payout_amount,
                                        icon:
                                            payout.payout_currency?.logo_uri ||
                                            '/img/tokens/ethereum-blue.png',
                                    };
                                })}
                                tags={bounty.skills}
                                winners={bounty.winner_count}
                                onApply={() =>
                                    viewModal.open({
                                        data: bounty,
                                        apply_tab: true,
                                        type: 'bounty',
                                    })
                                }
                                onView={() =>
                                    viewModal.open({
                                        data: bounty,
                                        apply_tab: false,
                                        type: 'bounty',
                                        status: getSubmissionDetails(bounty.bounty_id)?.status,
                                    })
                                }
                                isSaved={favBountyList.some(
                                    (item) => item.bounty_id === bounty.bounty_id
                                )}
                                settings={{
                                    onArchive: () => archiveBounty(bounty.bounty_id),
                                    onSave: () => FavouriteBounty(bounty.bounty_id),
                                    onUnsave: () => DeleteBounty(bounty.bounty_id),
                                    onEdit: () => editModal.open({ data: bounty }),
                                    onRemove: () => removeBounty(bounty.bounty_id),
                                }}
                                closed={bounty.status === 'closed'}
                                applyStatus={getSubmissionDetails(bounty.bounty_id)?.status}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <PopupBox
                active={addModal.active}
                onClose={addModal.close}
                effect="side"
                children={<JobsAddModal type="bounty" onClose={addModal.close} />}
            />
            <PopupBox
                active={editModal.active}
                onClose={editModal.close}
                effect="side"
                children={
                    <JobsAddModal
                        type="bounty"
                        onClose={editModal.close}
                        bountyData={editModal.payload?.data}
                        isEdit
                    />
                }
            />
            {viewModal?.payload && (
                <PopupBox
                    active={viewModal.active}
                    onClose={viewModal.close}
                    effect="side"
                    children={
                        <JobsViewModal
                            type={viewModal.payload.type}
                            apply_tab={viewModal.payload.apply_tab}
                            data={viewModal.payload.data}
                            applicantStatus={viewModal.payload?.status}
                            onClose={viewModal.close}
                            callback={(id) => {
                                const newSubmission: Submission = {
                                    submission_id: '',
                                    bounty_id: id!,
                                    submission: '',
                                    file: '',
                                    status: JobsEnums.ApplicantStatusType.APPLIED,
                                    rank: 0,
                                    feedback: '',
                                    updated_by: getMemberId(),
                                };
                                setSubmissions([...submissions, newSubmission]);
                            }}
                        />
                    }
                />
            )}
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};

export default Bounty;
