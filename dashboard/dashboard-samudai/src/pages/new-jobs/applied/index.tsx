import React, { useCallback, useEffect, useState } from 'react';
import {
    Applicant,
    BountyResponse,
    JobsEnums,
    OpportunityResponse,
    Submission,
} from '@samudai_xyz/gateway-consumer-types';
import {
    useGetOpenBountiesQuery,
    useGetPublicOpportunitiesQuery,
} from 'store/services/jobs/totalJobs';
import usePopup from 'hooks/usePopup';
import {
    JobsCard,
    JobsHeader,
    JobsTabs,
    useApplicants,
    useFavourites,
    useSubmissions,
} from 'components/@pages/new-jobs';
import { JobsViewModal } from 'components/@pages/new-jobs/ui/jobs-view-modal';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import { getMemberId } from 'utils/utils';
import css from './applied.module.scss';
import { useJobsFilter } from 'components/@pages/new-jobs/libs/hooks/use-jobs-filter';
import { JobsFilterInputs } from 'components/@pages/new-jobs/ui/types';

interface AppliedOpportunityDetails extends OpportunityResponse {
    applicantStatus: JobsEnums.ApplicantStatusType;
    applicant_id: string;
}

interface AppliedBountyDetails extends BountyResponse {
    submissionStatus: JobsEnums.ApplicantStatusType;
    submission_id: string;
}

const Applied: React.FC = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [appliedOpportunityList, setAppliedOpportunityList] = useState<Applicant[]>([]);
    const [appliedBountyList, setAppliedBountyList] = useState<Submission[]>([]);

    const { filter, setFilter } = useJobsFilter();
    const { data: opportunityList, isLoading } = useGetPublicOpportunitiesQuery(undefined);
    const { data: bountyList } = useGetOpenBountiesQuery();
    const memberId = getMemberId();
    const { getApplicantsForMember, isLoading: applicantLoading } = useApplicants(true);
    const { getSubmissionsForMember } = useSubmissions(true);
    const {
        getFilteredList: getFilteredFavouriteList,
        DeleteOpportunity,
        DeleteBounty,
    } = useFavourites();

    const viewModal = usePopup<{
        data: any;
        apply_tab: boolean;
        type: 'task' | 'bounty';
        status?: JobsEnums.ApplicantStatusType;
    }>();

    const getFilteredJobsList = useCallback(
        (filter: JobsFilterInputs) => {
            let list = [...appliedOpportunityList];
            if (!list?.length) {
                return [];
            }
            if (filter.search) {
                list = list.filter(
                    (item) =>
                        item?.job_details?.title.toLowerCase().includes(filter.search.toLowerCase())
                );
            }
            if (filter.dao_names.length) {
                list = list.filter((item) =>
                    filter.dao_names.includes(item?.job_details?.dao_name || '')
                );
            }
            if (filter.tags.length) {
                let check = false;
                list = list.filter((item) => {
                    if (!item?.job_details?.skills?.length) return false;
                    item?.job_details?.skills.forEach((skill: string) => {
                        if (filter.tags.includes(skill)) check = true;
                    });
                    return check;
                });
            }
            return list;
        },
        [appliedOpportunityList]
    );

    const getFilteredBountyList = useCallback(
        (filter: JobsFilterInputs) => {
            let list = [...appliedBountyList];
            if (!list?.length) {
                return [];
            }
            if (filter.search) {
                list = list.filter(
                    (item) =>
                        item?.bounty_details?.title
                            .toLowerCase()
                            .includes(filter.search.toLowerCase())
                );
            }
            if (filter.dao_names.length) {
                list = list.filter((item) =>
                    filter.dao_names.includes(item?.bounty_details?.dao_name || '')
                );
            }
            if (filter.tags.length) {
                let check = false;
                list = list.filter((item) => {
                    if (!item?.bounty_details?.skills?.length) return false;
                    item?.bounty_details?.skills.forEach((skill: string) => {
                        if (filter.tags.includes(skill)) check = true;
                    });
                    return check;
                });
            }
            return list;
        },
        [appliedBountyList]
    );

    useEffect(() => {
        if (memberId && opportunityList && bountyList) {
            getApplicantsForMember(memberId).then((res) => {
                const OpportunityMap = new Map(
                    opportunityList.data.opportunities.map((opportunity) => [
                        opportunity.job_id,
                        opportunity,
                    ])
                );
                const list: AppliedOpportunityDetails[] = [];
                res.map((applicant) => {
                    const opportunityDetails = OpportunityMap.get(applicant.job_id);
                    if (opportunityDetails) {
                        list.push({
                            ...opportunityDetails,
                            applicant_id: applicant.applicant_id,
                            applicantStatus: applicant.status,
                        });
                    }
                });
                setAppliedOpportunityList(res);
            });
            getSubmissionsForMember(memberId).then((res) => {
                const BountyMap = new Map(
                    bountyList.data.bounty.map((bounty) => [bounty.bounty_id, bounty])
                );
                const list: AppliedBountyDetails[] = [];
                res.map((submission) => {
                    const bountyDetails = BountyMap.get(submission.bounty_id);
                    if (bountyDetails) {
                        list.push({
                            ...bountyDetails,
                            submission_id: submission.submission_id,
                            submissionStatus: submission.status,
                        });
                    }
                });
                setAppliedBountyList(res);
            });
        }
    }, [memberId, opportunityList, bountyList]);

    if (applicantLoading || isLoading) {
        return <Loader />;
    }

    const taskListRender = getFilteredJobsList(filter);
    const bountyListRender = getFilteredBountyList(filter);
    const favoriteListRender = getFilteredFavouriteList(filter);

    return (
        <div className={css.applied} data-analytics-page="jobs_applied">
            <JobsHeader
                breadcrumbs={[{ name: 'Applied Jobs', disabled: true }]}
                title="Applied Jobs"
                currentLink="Applied Jobs"
                controls={{
                    filter: true,
                }}
                filter={filter}
                setFilter={setFilter}
            />
            <div className="container">
                <div className={css.content}>
                    <JobsTabs
                        activeTab={activeTab}
                        tabs={[
                            { name: 'tasks', count: getFilteredJobsList(filter).length },
                            { name: 'bounty', count: getFilteredBountyList(filter).length },
                            { name: 'saved', count: getFilteredFavouriteList(filter).length },
                        ]}
                        onChange={(tab) => setActiveTab(tab.name)}
                    />
                </div>

                {activeTab === 'tasks' && taskListRender.length > 0 && (
                    <ul className={css.list}>
                        {taskListRender.map((opportunity) => (
                            <li className={css.list_item} key={opportunity.applicant_id}>
                                <JobsCard
                                    title={opportunity?.job_details?.title || ''}
                                    projectName={opportunity?.job_details?.project_name}
                                    daoName={opportunity?.job_details?.dao_name}
                                    daoId={opportunity?.job_details?.dao_id}
                                    className={css.list_item_titleRed}
                                    reviewer={opportunity?.job_details?.poc_member}
                                    payout={opportunity?.job_details?.payout?.map((payout) => {
                                        return {
                                            currency: payout.payout_currency,
                                            value: payout.payout_amount,
                                            icon:
                                                payout.payout_currency.logo_uri ||
                                                '/img/tokens/ethereum-blue.png',
                                        };
                                    })}
                                    onView={() =>
                                        viewModal.open({
                                            data: opportunity.job_details,
                                            apply_tab: false,
                                            type: 'task',
                                            status: appliedOpportunityList.find(
                                                (item) => item.job_id === opportunity.job_id
                                            )?.status,
                                        })
                                    }
                                    applyStatus={opportunity.status}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                {activeTab === 'bounty' && bountyListRender.length > 0 && (
                    <ul className={css.list}>
                        {bountyListRender.map((bounty) => (
                            <li className={css.list_item} key={bounty.submission_id}>
                                <JobsCard
                                    title={bounty?.bounty_details?.title || ''}
                                    projectName={bounty?.bounty_details?.project_name}
                                    daoName={bounty?.bounty_details?.dao_name}
                                    daoId={bounty?.bounty_details?.dao_id}
                                    className={css.list_item_titleRed}
                                    reviewer={bounty?.bounty_details?.poc_member}
                                    payout={bounty?.bounty_details?.payout?.map((payout) => {
                                        return {
                                            currency: payout.payout_currency,
                                            value: payout.payout_amount,
                                            icon:
                                                payout.payout_currency.logo_uri ||
                                                '/img/tokens/ethereum-blue.png',
                                        };
                                    })}
                                    onView={() =>
                                        viewModal.open({
                                            data: bounty.bounty_details,
                                            apply_tab: false,
                                            type: 'bounty',
                                            status: appliedBountyList.find(
                                                (item) => item.bounty_id === bounty.bounty_id
                                            )?.status,
                                        })
                                    }
                                    winners={bounty?.bounty_details?.winner_count}
                                    applyStatus={bounty.status}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                {activeTab === 'saved' && favoriteListRender.length > 0 && (
                    <ul className={css.list}>
                        {favoriteListRender.map((favourite, index) => (
                            <li className={css.list_item} key={index}>
                                <JobsCard
                                    title={favourite.title}
                                    projectName={favourite?.project_name}
                                    daoName={favourite?.dao_name}
                                    daoId={favourite?.dao_id}
                                    reviewer={favourite?.poc_member}
                                    type={favourite.type}
                                    payout={favourite.payout?.map((payout: any) => {
                                        return {
                                            currency: payout.payout_currency,
                                            value: payout.payout_amount,
                                            icon:
                                                payout.payout_currency.logo_uri ||
                                                '/img/tokens/ethereum-blue.png',
                                        };
                                    })}
                                    winners={
                                        favourite.type === 'bounty'
                                            ? favourite.winner_count
                                            : undefined
                                    }
                                    tags={favourite.skills}
                                    onApply={() =>
                                        viewModal.open({
                                            data: favourite,
                                            apply_tab: true,
                                            type: favourite.type === 'bounty' ? 'bounty' : 'task',
                                        })
                                    }
                                    onView={() =>
                                        viewModal.open({
                                            data: favourite,
                                            apply_tab: false,
                                            type: favourite.type === 'bounty' ? 'bounty' : 'task',
                                            status:
                                                favourite.type === 'bounty'
                                                    ? appliedBountyList.find(
                                                          (item) =>
                                                              item.bounty_id === favourite.bounty_id
                                                      )?.status
                                                    : appliedOpportunityList.find(
                                                          (item) => item.job_id === favourite.job_id
                                                      )?.status,
                                        })
                                    }
                                    settings={{
                                        onRemove: () => {
                                            if (favourite.type === 'bounty') {
                                                DeleteBounty(favourite.bounty_id);
                                            } else {
                                                DeleteOpportunity(favourite.job_id);
                                            }
                                        },
                                    }}
                                    applyStatus={
                                        favourite.type === 'bounty'
                                            ? appliedBountyList.find(
                                                  (item) => item.bounty_id === favourite.bounty_id
                                              )?.status
                                            : appliedOpportunityList.find(
                                                  (item) => item.job_id === favourite.job_id
                                              )?.status
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {viewModal.payload && (
                <PopupBox
                    active={viewModal.active}
                    onClose={viewModal.close}
                    effect="side"
                    children={
                        <JobsViewModal
                            type={viewModal.payload.type}
                            apply_tab={viewModal.payload.apply_tab}
                            data={viewModal.payload.data}
                            onClose={viewModal.close}
                            applicantStatus={viewModal.payload?.status}
                        />
                    }
                />
            )}
        </div>
    );
};

export default Applied;
