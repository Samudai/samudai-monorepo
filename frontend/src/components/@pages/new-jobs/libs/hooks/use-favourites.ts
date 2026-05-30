import { BountyResponse, OpportunityResponse } from '@samudai_xyz/gateway-consumer-types';
import { useCallback, useEffect, useState } from 'react';
import { favouriteBountyRequest, favouriteOpportunityRequest } from 'store/services/jobs/model';
import {
    useGetFavouriteOpportunitiesForMemberQuery,
    useGetFavouriteBountiesForMemberQuery,
    useFavouriteBountyMutation,
    useFavouriteOpportunityMutation,
    useDeleteFavouriteBountyMutation,
    useDeleteFavouriteOpportunityMutation,
} from 'store/services/jobs/totalJobs';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { JobsFilterInputs } from '../../ui/types';

export const useFavourites = (noFetch?: boolean) => {
    const [favOpportunityList, setFavOpportunityList] = useState<OpportunityResponse[]>([]);
    const [favBountyList, setFavBountyList] = useState<BountyResponse[]>([]);
    const [favourites, setFavourites] = useState<any[]>([]);

    const memberId = getMemberId();
    const { data: jobData, isLoading: firstLoading } = useGetFavouriteOpportunitiesForMemberQuery(
        memberId,
        { skip: !memberId || noFetch }
    );
    const { data: bountyData, isLoading: secondLoading } = useGetFavouriteBountiesForMemberQuery(
        memberId,
        { skip: !memberId || noFetch }
    );
    const [createFavOpportunity] = useFavouriteOpportunityMutation();
    const [createFavBounty] = useFavouriteBountyMutation();
    const [deleteFavOpportunity] = useDeleteFavouriteOpportunityMutation();
    const [deleteFavBounty] = useDeleteFavouriteBountyMutation();

    const getFilteredList = useCallback(
        (filter: JobsFilterInputs) => {
            let list = [...favourites];
            if (!list?.length) {
                return [];
            }
            if (filter.search) {
                list = list.filter((item) =>
                    item.title.toLowerCase().includes(filter.search.toLowerCase())
                );
            }
            if (filter.dao_names.length) {
                list = list.filter((item) => filter.dao_names.includes(item.dao_name));
            }
            if (filter.tags.length) {
                let check = false;
                list = list.filter((item) => {
                    if (!item.skills?.length) return false;
                    item.skills.forEach((skill: string) => {
                        if (filter.tags.includes(skill)) check = true;
                    });
                    return check;
                });
            }
            return list;
        },
        [favourites]
    );

    useEffect(() => {
        if (jobData?.data) {
            setFavOpportunityList(jobData.data?.favourite_list || []);
        }
    }, [jobData]);

    useEffect(() => {
        if (bountyData?.data) {
            setFavBountyList(bountyData?.data.favourite_list || []);
        }
    }, [bountyData]);

    useEffect(() => {
        if (jobData?.data || bountyData?.data) {
            const list: any[] = [];
            jobData?.data?.favourite_list?.forEach((opportunity) => {
                list.push({
                    ...opportunity,
                    type: 'task',
                });
            });
            bountyData?.data?.favourite_list?.forEach((bounty) => {
                list.push({
                    ...bounty,
                    type: 'bounty',
                });
            });
            setFavourites(list);
        }
    }, [jobData, bountyData]);

    const FavouriteOpportunity = async (job_id: string) => {
        const payload: favouriteOpportunityRequest = {
            favourite: {
                job_id,
                member_id: memberId,
            },
        };
        await createFavOpportunity(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is saved successfully', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to save job', '')();
            });
    };

    const DeleteOpportunity = async (jobId: string) => {
        await deleteFavOpportunity({ jobId, memberId })
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job unsaved successfully', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to unsave job', '')();
            });
    };

    const FavouriteBounty = async (bounty_id: string) => {
        const payload: favouriteBountyRequest = {
            favourite: {
                bounty_id,
                member_id: memberId,
            },
        };
        await createFavBounty(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Bounty is saved successfully', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to save bounty', '')();
            });
    };

    const DeleteBounty = async (bountyId: string) => {
        await deleteFavBounty({ bountyId, memberId })
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Bounty unsaved successfully', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to unsave bounty', '')();
            });
    };

    return {
        loading: firstLoading || secondLoading,
        favOpportunityList,
        favBountyList,
        favourites,
        getFilteredList,
        FavouriteOpportunity,
        FavouriteBounty,
        DeleteOpportunity,
        DeleteBounty,
    };
};
