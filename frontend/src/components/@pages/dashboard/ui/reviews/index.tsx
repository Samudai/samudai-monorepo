import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetReviewQuery } from 'store/services/Dashboard/dashboard';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import Rating from 'ui/Rating/Rating';
import PlusIcon from 'ui/SVG/PlusIcon';
import { Stars } from 'ui/stars';
import { ReviewsAddPopup, ReviewsItem, ReviewsPopup, ReviewsSkeleton } from './components';
import styles1 from './components/reviews-popup/reviews-popup.module.scss';
import styles from './reviews.module.scss';

interface ReviewsProps {
    className?: string;
}

export const Reviews: React.FC<ReviewsProps> = ({ className }) => {
    const [data, setData] = useState<any[]>([]);
    const reviewPopupState = usePopup();
    const reviewAdd = usePopup();
    const { daoid } = useParams();

    const navigate = useNavigate();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [loading, setLoading] = useState(false);
    const [getReview] = useLazyGetReviewQuery();
    const [totalRatings, setTotalRatings] = useState(0);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const fetchData = () => {
        setLoading(true);
        getReview(daoid!, true)
            .unwrap()
            .then((res) => {
                setData(res?.data || []);
                setLoading(false);
                let totalRatings = 0;
                res?.data?.forEach((item: any) => {
                    totalRatings += Number(item.rating);
                });
                setTotalRatings(totalRatings);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [activeDAO, daoid]);

    return (
        <Block className={clsx(styles.root, className)} data-analytics-parent="reviews_widget">
            {data.length >= 0 && (
                <Block.Header className={styles.header}>
                    <Block.Title>Reviews</Block.Title>
                    {data.length >= 0 && (
                        <Button
                            onClick={() => {
                                if (trialDashboard) discordModal.open();
                                else reviewAdd.open();
                            }}
                            className={styles.root_open}
                            data-analytics-click="post_review_button"
                        >
                            <PlusIcon /> Post
                        </Button>
                    )}
                    <Block.Link
                        className={styles.root_link}
                        onClick={reviewPopupState.open}
                        data-analytics-click="review_widget_expand"
                    />
                </Block.Header>
            )}
            <Block.Scrollable className={styles.scrollable}>
                <Skeleton
                    className={styles.skeleton}
                    loading={loading}
                    skeleton={<ReviewsSkeleton />}
                >
                    {data.length > 0 ? (
                        <div className={styles.main}>
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
                                    data-analytics-click="review_widget_expand"
                                >
                                    +{data.length - 2} more
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className={styles.preview}>
                            <div className={styles.preview_head}>
                                {/* <Block.Title>Reviews</Block.Title> */}
                                {/* <Block.Link /> */}
                            </div>

                            <div className={styles.preview_content}>
                                <h4 className={styles.preview_rating}>4.2</h4>

                                <Stars
                                    className={styles.preview_stars}
                                    colorActive="#2B2E31"
                                    colorDefault="#2B2E31"
                                    rate={4.2}
                                    size={17.25}
                                />

                                <p className={styles.preview_text}>
                                    <span>Your DAO reviews will be shown here.</span>
                                </p>

                                {/* {access ? (
                                    <p className={styles.preview_text}>
                                        <span>Your DAO reviews will be shown here.</span>
                                    </p>
                                ) : (
                                    <>
                                        <p className={styles.preview_text}>
                                            <span>Your reviews will come in here.</span>
                                            <span>Look for a project!</span>
                                        </p>
                                        <Button
                                            className={styles.preview_addBtn}
                                            color="orange-outlined"
                                            onClick={() => navigate(`/${daoid}/projects`)}
                                            data-analytics-click="start_project_fromReview_button"
                                    >
                                            <span>Start a Project</span>
                                        </Button>
                                    </>
                                )} */}

                                {/* <h2 className={styles.reviewsPreviewTitle}>Reviews</h2> */}
                                {/* {!access && (
                                                    <button
                                    
                                        className={styles.reviewsPreviewBtn}
                                    
                                        onClick={reviewAdd.open}
                                    
                                        data-analytics-click="post_review_button"
                                    >
                                                        <FavoriteIcon />
                                                        <span>Post a Review</span>
                                                    </button>
                                            )} */}
                                {/* <ReviewPreview className={styles.reviewsPreviewPreview} /> */}
                            </div>
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
                    onClose={reviewPopupState.close}
                    dataParentId={'review_details_popup'}
                />
            </PopupBox>

            <PopupBox active={reviewAdd.active} onClose={reviewAdd.close}>
                <ReviewsAddPopup
                    onClose={reviewPopupState.close}
                    fetchData={fetchData}
                    onClose1={reviewAdd.close}
                    dataParentId={'add_review_popup'}
                />
            </PopupBox>
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </Block>
    );
};
