import React, { useMemo } from 'react';
import { DaoReviewsItem } from '../dao-reviews-item';
import { DaoBlockSkeleton } from '../dao-skeleton';
import clsx from 'clsx';
import usePopup from 'hooks/usePopup';
import { ReviewsAddPopup } from 'components/@pages/dashboard';
import useFetchDao from 'components/@pages/new-discovery/lib/hooks/use-fetch-dao';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import { Skeleton } from 'components/new-skeleton';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import { Stars } from 'ui/stars';
import css from './dao-reviews.module.scss';

interface DaoReviewsProps {}

export const DaoReviews: React.FC<DaoReviewsProps> = (props) => {
    const { reviewList, reviewLoading, daoData } = useFetchDao();
    const reviewsModal = usePopup();
    const reviewAdd = usePopup();

    const overallRating = useMemo(() => {
        if (!reviewList.length) return null;
        const total = reviewList.reduce((total: number, review: any) => total + review.rating, 0);
        return total / reviewList.length;
    }, [reviewList]);

    if (reviewLoading) {
        return (
            <>
                <Skeleton
                    styles={{
                        maxWidth: 155,
                        height: 33,
                        borderRadius: 5,
                        marginBottom: 16,
                    }}
                />

                <DaoBlockSkeleton />
            </>
        );
    }

    return (
        <div className={css.reviews}>
            <div className={css.head}>
                <h3 className={css.head_title}>Reviews</h3>
                <div className={css.head_btn_container}>
                    {!!overallRating && (
                        <Button className={css.head_btn} onClick={reviewAdd.open}>
                            Add Review
                        </Button>
                    )}
                    <button
                        className={css.head_link}
                        onClick={() => reviewList.length && reviewsModal.open()}
                    >
                        <Sprite url="/img/sprite.svg#arrow-send" />
                    </button>
                </div>
            </div>

            <div className={css.content}>
                {overallRating === null && (
                    <div className={css.empty}>
                        <div className={css.empty_left}>
                            <div className={css.empty_rating}>
                                <span>4.2</span>
                            </div>

                            <Stars
                                className={css.empty_stars}
                                rate={3}
                                size={17}
                                colorActive="#1F2123"
                                colorDefault="#2B2E31"
                            />
                        </div>

                        <div className={css.empty_right}>
                            <p className={css.empty_text}>
                                Add a Rating for {daoData?.name} Drop a Review.
                            </p>

                            <Button
                                className={css.empty_btn}
                                color="orange-outlined"
                                onClick={reviewAdd.open}
                            >
                                <span>Add Rating</span>
                            </Button>
                        </div>
                    </div>
                )}
                {overallRating !== null && (
                    <>
                        <div className={css.data}>
                            <h5 className={css.data_title}>Overall rating:</h5>
                            <p className={css.data_rating}>{overallRating.toFixed(2)}</p>
                            <Stars className={css.data_stars} rate={overallRating} />
                            <p className={css.data_votes}>{reviewList.length} Votes</p>
                        </div>

                        <ul className={css.list}>
                            {reviewList.slice(0, 2).map((item) => (
                                <li className={css.list_item} key={item.id}>
                                    <DaoReviewsItem data={item} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            <PopupBox active={reviewAdd.active} onClose={reviewAdd.toggle}>
                <ReviewsAddPopup onClose={reviewAdd.close} />
            </PopupBox>
            <PopupBox active={reviewsModal.active} onClose={reviewsModal.toggle}>
                <Popup className={css.popup_root}>
                    <PopupTitle
                        className={css.popup_title}
                        title="Reviews"
                        icon="/img/icons/file.png"
                    />
                    <ul className={clsx(css.list, css.popup_list)}>
                        {reviewList.map((item) => (
                            <li className={css.list_item} key={item.id}>
                                <DaoReviewsItem data={item} />
                            </li>
                        ))}
                    </ul>
                </Popup>
            </PopupBox>
        </div>
    );
};
