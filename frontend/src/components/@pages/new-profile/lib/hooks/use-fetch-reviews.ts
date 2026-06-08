import { useParams } from 'react-router-dom';
import { useGetUserReviewQuery } from 'store/services/Dashboard/dashboard';
import { getMemberId } from 'utils/utils';

export const useFetchReviews = () => {
    const { memberid } = useParams();

    const { data: reviewData, isLoading } = useGetUserReviewQuery(memberid!, { skip: !memberid });

    return {
        reviewList: reviewData?.data?.reviews || [],
        isLoading,
        isMyProfile: memberid === getMemberId(),
    };
};
