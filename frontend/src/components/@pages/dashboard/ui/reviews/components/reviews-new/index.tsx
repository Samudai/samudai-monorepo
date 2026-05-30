import { useEffect, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ReviewsAddPopup, ReviewsItem, ReviewsPopup, ReviewsPreview, ReviewsSkeleton } from '..';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazyGetUserReviewQuery } from 'store/services/Dashboard/dashboard';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import Rating from 'ui/Rating/Rating';
import FavoriteIcon from 'ui/SVG/FavoriteIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import { getMemberId } from 'utils/utils';
import styles from '../../reviews.module.scss';
import styles1 from '../reviews-popup/reviews-popup.module.scss';

interface ReviewsProps {
    className?: string;
}

export const ReviewsNew: React.FC<ReviewsProps> = ({ className }) => {
    const [data, setData] = useState<any[]>([]);
    const reviewPopupState = usePopup();
    const reviewAdd = usePopup();
    const [getReview] = useLazyGetUserReviewQuery();
    const { memberid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [loading, setLoading] = useState(false);
    const [totalRatings, setTotalRatings] = useState(0);
    const sameProfile = getMemberId() === memberid;
    const fetchData = () => {
        setLoading(true);
        getReview(memberid!, true)
            .unwrap()
            .then((res) => {
                console.log(res.data);
                setData(res?.data?.reviews || []);
                setLoading(false);
                console.log(res);
                let totalRatings = 0;
                res?.data?.reviews?.forEach((item: any) => {
                    totalRatings += Number(item.rating);
                });
                setTotalRatings(totalRatings);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [memberid]);

    return (
        <Block className={clsx(styles.root, className)}>
            {data.length > 0 && (
                <Block.Header className={styles.header}>
                    <Block.Title>Reviews</Block.Title>
                    {data.length > 0 && !sameProfile && (
                        <div style={{ marginLeft: '54%' }}>
                            <Button onClick={reviewAdd.open}>
                                <PlusIcon /> Post
                            </Button>
                        </div>
                    )}
                    <Block.Link onClick={reviewPopupState.open} />
                </Block.Header>
            )}
            <Block.Scrollable>
                <Skeleton loading={loading} skeleton={<ReviewsSkeleton />}>
                    {data.length > 0 ? (
                        <div className={styles.main}>
                            {/* {!sameProfile && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={reviewAdd.open}>
                    <PlusIcon /> Post
                  </Button>
                </div>
              )} */}
                            <h4 className={styles.suptitle}>Overall rating</h4>
                            <div className={styles.info}>
                                <span className={styles.infoAverage}>
                                    {(totalRatings / data.length).toFixed(2)}
                                </span>
                                <Rating
                                    className={styles1.controlsRating}
                                    rate={totalRatings / data.length}
                                />
                                <span className={styles.infoVotes}>{data?.length} Votes</span>
                            </div>
                            <ul className={styles.list}>{data?.slice(0, 2).map(ReviewsItem)}</ul>
                            {data.length > 2 && (
                                <p
                                    style={{
                                        color: '#fdc087',
                                        marginTop: '10px',
                                        textAlign: 'right',
                                        marginRight: '20px',
                                        font: '400 14px/1.25 "Lato", sans-serif',
                                        cursor: 'pointer',
                                    }}
                                    onClick={reviewPopupState.open}
                                >
                                    +{data.length - 2} more
                                </p>
                            )}
                        </div>
                    ) : (
                        <div
                            className={styles.reviewsPreview}
                            style={{ display: 'flex', justifyContent: 'flex-end', margin: '0' }}
                        >
                            <h2 className={styles.reviewsPreviewTitle}>Reviews</h2>
                            {!sameProfile && (
                                <button
                                    className={styles.reviewsPreviewBtn}
                                    onClick={reviewAdd.open}
                                >
                                    <FavoriteIcon />
                                    <span>Post a Review</span>
                                </button>
                            )}
                            <ReviewsPreview className={styles.reviewsPreviewPreview} />
                        </div>
                    )}
                </Skeleton>
            </Block.Scrollable>
            <PopupBox active={reviewPopupState.active} onClose={reviewPopupState.close}>
                <ReviewsPopup
                    reviews={data || []}
                    fetchData={fetchData}
                    openAddPopup={reviewAdd.open}
                    average={totalRatings / data.length}
                    total={data.length}
                    sameProfile={sameProfile}
                    contributor={true}
                />
            </PopupBox>
            <PopupBox active={reviewAdd.active} onClose={reviewAdd.close}>
                <ReviewsAddPopup
                    onClose={reviewPopupState.close}
                    fetchData={fetchData}
                    onClose1={reviewAdd.close}
                    user
                />
            </PopupBox>
        </Block>
    );
};
