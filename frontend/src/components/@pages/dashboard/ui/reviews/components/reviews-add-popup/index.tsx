import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types/';
import { selectActiveDao } from 'store/features/common/slice';
import {
    useAddReviewsMutation,
    useAddUserReviewsMutation,
} from 'store/services/Dashboard/dashboard';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import InputStars from 'ui/@form/InputStars/InputStars';
import TextArea from 'ui/@form/TextArea/TextArea';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './reviews-add-popup.module.scss';

interface AddReviewProps {
    onClose?: () => void;
    fetchData?: () => void;
    onClose1?: () => void;
    user?: boolean;
    dataParentId?: string;
}

export const ReviewsAddPopup: React.FC<AddReviewProps> = ({
    onClose,
    onClose1,
    fetchData,
    user,
    dataParentId,
}) => {
    const [addReview] = useAddReviewsMutation();
    const [addUserReview] = useAddUserReviewsMutation();
    const { id, memberid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [stars, setStars] = useState(0);
    const [link, setLink, _, clearlink] = useInput<HTMLTextAreaElement>('');

    const computedForm = useMemo(() => {
        const starsValue = stars;
        const linkValue = link.trim();
        const isValid = starsValue > 0 && starsValue < 6 && linkValue !== '';

        return {
            isValid,
            starsValue,
            linkValue,
        };
    }, [stars, link]);

    const addBlogHandler = () => {
        if (!computedForm.isValid) {
            toast('Failure', 5000, 'Review fields cannot be empty', '')();
            return;
        }
        !user &&
            addReview({
                review: {
                    dao_id: activeDAO!,
                    content: computedForm.linkValue,
                    member_id: getMemberId(),
                    rating: computedForm.starsValue,
                },
            })
                .unwrap()
                .then((res) => {
                    console.log(res);
                    updateActivity({
                        dao_id: id!,
                        member_id: getMemberId(),
                        action_type: ActivityEnums.ActionType.REVIEW_ADDED,
                        visibility: ActivityEnums.Visibility.PUBLIC,
                        member: {
                            username: store.getState().commonReducer?.member?.data.username || '',
                            profile_picture:
                                store.getState().commonReducer?.member?.data.profile_picture || '',
                        },
                        dao: {
                            dao_name: store.getState().commonReducer?.activeDaoName || '',
                            profile_picture: store.getState().commonReducer?.profilePicture || '',
                        },
                        project: {
                            project_name: '',
                        },
                        task: {
                            task_name: '',
                        },
                        action: {
                            message: '',
                        },
                        metadata: {},
                    });
                    clearlink();
                    onClose1?.();
                    onClose?.();
                    setTimeout(() => {
                        fetchData?.();
                    }, 3000);
                })
                .catch((err) => {
                    console.error(err);
                });
        user &&
            addUserReview({
                review: {
                    reviewer_id: memberid!,
                    content: computedForm.linkValue,
                    member_id: getMemberId(),
                    rating: computedForm.starsValue,
                    dao_id: id!,
                },
            })
                .unwrap()
                .then((res) => {
                    console.log('add review', res);
                    updateActivity({
                        dao_id: id!,
                        member_id: getMemberId(),
                        action_type: ActivityEnums.ActionType.REVIEW_ADDED,
                        visibility: ActivityEnums.Visibility.PUBLIC,
                        member: {
                            username: store.getState().commonReducer?.member?.data.username || '',
                            profile_picture:
                                store.getState().commonReducer?.member?.data.profile_picture || '',
                        },
                        dao: {
                            dao_name: store.getState().commonReducer?.activeDaoName || '',
                            profile_picture: store.getState().commonReducer?.profilePicture || '',
                        },
                        project: {
                            project_name: '',
                        },
                        task: {
                            task_name: '',
                        },
                        action: {
                            message: '',
                        },
                        metadata: {},
                    });
                    clearlink();
                    onClose1?.();
                    onClose?.();
                    setTimeout(() => {
                        fetchData?.();
                    }, 3000);
                })
                .catch((err) => {
                    console.error(err);
                });
    };

    return (
        <Popup className={styles.root} onClose={onClose1} dataParentId={dataParentId}>
            <PopupTitle
                icon="/img/icons/write.png"
                title={
                    <>
                        Post <strong>New</strong> Review
                    </>
                }
            />
            <PopupSubtitle text="Rate the Project" className={styles.rateSubtitle} />
            <InputStars
                className={styles.rating}
                numberValue={computedForm.starsValue.toFixed(1)}
                value={stars}
                onChange={(value: number) => setStars(value)}
            />
            <PopupSubtitle text="Your Review" className={styles.reviewSubtitle} />
            <TextArea
                placeholder="Write your review"
                value={link}
                onChange={setLink}
                className={styles.textArea}
            />
            <Button
                color="green"
                className={styles.postBtn}
                disabled={!computedForm.isValid}
                onClick={addBlogHandler}
                data-analytics-click="submit_review"
            >
                <span>Post</span>
            </Button>
        </Popup>
    );
};
