import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectActiveDao } from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import { ReviewsAddPopup } from 'components/@pages/dashboard';
import { useFetchReviews } from 'components/@pages/new-profile/lib/hooks';
import { useProfile } from 'components/@pages/new-profile/providers';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { Skeleton } from 'components/new-skeleton';
import Button from 'ui/@buttons/Button/Button';
import { Stars } from 'ui/stars';
import css from './profile-rating.module.scss';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Sprite from 'components/sprite';

export const ProfileRating = () => {
    const { reviewList, isMyProfile, isLoading } = useFetchReviews();
    const { userData } = useProfile();
    const navigate = useNavigate();
    const activeDao = useTypedSelector(selectActiveDao);
    const reviewAdd = usePopup();
    const reviewsModal = usePopup();

    const overallRating = useMemo(() => {
        if (!reviewList.length) return null;
        const total = reviewList.reduce((total, review) => total + review.rating, 0);
        return total / reviewList.length;
    }, [reviewList]);

    if (isLoading) {
        return (
            <Skeleton
                styles={{
                    height: 247,
                    borderRadius: 15,
                }}
            />
        );
    }

    if (overallRating === null) {
        return (
            <div className={css.skel}>
                <div className={css.addbtn_container}>
                    <h3 className={css.title}>Overall Rating</h3>
                </div>

                <div className={css.skel_row}>
                    <div className={css.skel_col}>
                        <div className={css.skel_rate}>4.2</div>
                        <Stars
                            className={css.skel_stars}
                            size={19}
                            rate={4.2}
                            colorActive="#2B2E31"
                            colorDefault="#1F2123"
                        />
                    </div>
                    <div className={css.skel_col}>
                        {isMyProfile && (
                            <>
                                <p className={css.skel_text}>
                                    Let’s perform some high quality bounties for reviews.
                                </p>

                                <Button
                                    className={css.skel_btn}
                                    color="orange-outlined"
                                    onClick={() => navigate(`/jobs/tasks`)}
                                    data-analytics-click="find_projects_button"
                                >
                                    <span>Look for Jobs/Bounties</span>
                                </Button>
                            </>
                        )}
                        {!isMyProfile && (
                            <>
                                <p className={css.skel_text}>
                                    Add a Rating for {userData?.member?.name}
                                </p>
                                <Button
                                    className={css.skel_btn}
                                    color="orange-outlined"
                                    onClick={reviewAdd.open}
                                    data-analytics-click="add_rating_button"
                                >
                                    <span>Add a Rating</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <PopupBox active={reviewAdd.active} onClose={reviewAdd.toggle}>
                    <ReviewsAddPopup onClose={reviewAdd.close} user />
                </PopupBox>
            </div>
        );
    }

    return (
        <div className={css.root}>
            <div className={css.addbtn_container}>
                <h3 className={css.title}>Overall Rating</h3>
                <div className={css.head_btn}>
                    {!isMyProfile && <Button onClick={reviewAdd.open}>Add Review</Button>}
                    <button
                        className={css.head_link}
                        onClick={() => reviewList.length && reviewsModal.open()}
                    >
                        <Sprite url="/img/sprite.svg#arrow-send" />
                    </button>
                </div>
            </div>

            <div className={css.content}>
                <div className={css.content_data}>
                    <div className={css.content_data_inner}>
                        <h4 className={css.content_rating}>{overallRating.toFixed(1)}</h4>
                        <div className={css.content_col}>
                            <Stars rate={overallRating} />
                            <p className={css.content_votes}>{reviewList.length} Votes</p>
                        </div>
                    </div>
                </div>

                {reviewList.slice(0, 2).map((item) => (
                    <div className={css.item} key={item.id}>
                        <div className={css.item_head}>
                            <div className={css.item_picture}>
                                <img
                                    src={item.profile_picture || '/img/icons/user-2.png'}
                                    alt="avatar"
                                    className="img-cover"
                                />
                            </div>

                            <h5 className={css.item_name}>{item.name}</h5>

                            <Stars
                                className={css.item_stars}
                                rate={item.rating}
                                colorActive="#E6CCFF"
                            />
                        </div>

                        <p className={css.item_text}>{item.content}</p>

                        {/* <Sprite className={css.item_note} url="/img/sprite.svg#note" /> */}
                    </div>
                ))}
            </div>
            <PopupBox active={reviewAdd.active} onClose={reviewAdd.toggle}>
                <ReviewsAddPopup onClose={reviewAdd.close} user />
            </PopupBox>
            <PopupBox active={reviewsModal.active} onClose={reviewsModal.toggle}>
                <Popup className={css.popup_root}>
                    <PopupTitle
                        className={css.popup_title}
                        title="Reviews"
                        icon="/img/icons/file.png"
                    />
                    {reviewList.map((item) => (
                        <div className={css.item} style={{ width: '100%' }} key={item.id}>
                            <div className={css.item_head}>
                                <div className={css.item_picture}>
                                    <img
                                        src={item.profile_picture || '/img/icons/user-2.png'}
                                        alt="avatar"
                                        className="img-cover"
                                    />
                                </div>

                                <h5 className={css.item_name}>{item.name}</h5>

                                <Stars
                                    className={css.item_stars}
                                    rate={item.rating}
                                    colorActive="#E6CCFF"
                                />
                            </div>

                            <p className={css.item_text}>{item.content}</p>

                            {/* <Sprite className={css.item_note} url="/img/sprite.svg#note" /> */}
                        </div>
                    ))}
                </Popup>
            </PopupBox>
        </div>
    );
};
