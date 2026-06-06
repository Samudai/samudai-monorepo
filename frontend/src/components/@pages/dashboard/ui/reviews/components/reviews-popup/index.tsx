import { useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types/';
import clsx from 'clsx';
import { selectAccess } from 'store/features/common/slice';
import { blogData } from 'store/services/Dashboard/model';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import Rating from 'ui/Rating/Rating';
import FavoriteIcon from 'ui/SVG/FavoriteIcon';
import { ReviewsPopupItem } from '../reviews-popup-item';
import styles from './reviews-popup.module.scss';

interface ReviewPopupProps {
    reviews: blogData[];
    openAddPopup: () => void;
    fetchData: () => void;
    onClose?: () => void;
    average: number;
    total: number;
    sameProfile?: boolean;
    contributor?: boolean;
    dataParentId?: string;
}

export const ReviewsPopup: React.FC<ReviewPopupProps> = ({
    reviews,
    fetchData,
    openAddPopup,
    average,
    total,
    sameProfile,
    contributor,
    onClose,
    dataParentId,
}) => {
    const [page, setPage] = useState(0);
    const MAX_ELEMENTS_PER_PAGE = 10;
    const [COUNT_SHOW_PAGES, SET_COUNT_SHOW_PAGES] = useState(
        Math.ceil(reviews.length / MAX_ELEMENTS_PER_PAGE)
    );

    const access = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);

    const handleNavPage = (next: number) => {
        const nextPage = page + next;
        if (nextPage <= 0 || nextPage >= COUNT_SHOW_PAGES) return;

        if (nextPage !== 0) {
            setPage(nextPage);
        }
    };

    const handleChangePage = (page?: number) => {
        if (page !== undefined) {
            setPage(page);
        }
    };

    const renderReviews = useMemo(() => {
        return reviews.slice(
            page * MAX_ELEMENTS_PER_PAGE,
            page * MAX_ELEMENTS_PER_PAGE + MAX_ELEMENTS_PER_PAGE
        );
    }, [reviews, page]);

    console.log(reviews, renderReviews);

    return (
        <Popup
            className={clsx(styles.root, renderReviews.length < 3 && styles.rootSmall)}
            onClose={onClose}
            dataParentId={dataParentId}
        >
            <div className={styles.head}>
                <h2 className={styles.headTitle}> Reviews</h2>
                <button
                    className={clsx(styles.controlsBtn, styles.controlsBtnMobile)}
                    onClick={openAddPopup}
                >
                    <FavoriteIcon />
                    <span>Post a Review</span>
                </button>
            </div>
            <div className={styles.controls}>
                <div className={styles.controlsLeft}>
                    <h4 className={styles.controlsTitle}>Avg Rating</h4>
                    <div className={styles.controlsDown}>
                        <p className={styles.controlsNumber}>{average.toFixed(2)}</p>
                        <Rating className={styles.controlsRating} rate={average} />
                        <p className={styles.controlsBased}>Based on {total} reviews</p>
                    </div>
                </div>
                {!access && (!contributor || !sameProfile) && (
                    <button
                        className={styles.controlsBtn}
                        onClick={openAddPopup}
                        data-analytics-click="post_review_button"
                    >
                        <FavoriteIcon />
                        <span>Post a Review</span>
                    </button>
                )}
            </div>
            <ul className={clsx(styles.list, 'orange-scrollbar')}>
                {/* {reviews.slice(page, MAX_ELEMENTS_PER_PAGE).map((review) => ( */}
                {renderReviews.map((review) => (
                    <ReviewsPopupItem
                        review={review}
                        content={(review as any).content}
                        rating={(review as any).rating}
                        createdAt={review.created_at}
                        key={review.id}
                    />
                ))}
            </ul>
            <ReactPaginate
                className={styles.paginate}
                pageClassName={styles.paginatePage}
                activeClassName={styles.paginatePageActive}
                pageCount={Math.ceil(reviews.length / MAX_ELEMENTS_PER_PAGE)}
                forcePage={page}
                marginPagesDisplayed={0}
                pageRangeDisplayed={COUNT_SHOW_PAGES}
                breakLabel={false}
                onClick={({ nextSelectedPage }) => handleChangePage(nextSelectedPage)}
                previousLabel={<NavButton onClick={() => handleNavPage(-1)} />}
                nextLabel={<NavButton variant="next" onClick={() => handleNavPage(1)} />}
            />
        </Popup>
    );
};
