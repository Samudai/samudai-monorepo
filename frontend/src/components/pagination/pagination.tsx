import clsx from 'clsx';
import React from 'react';
import ReactPaginate from 'react-paginate';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import styles from './pagination.module.scss';

interface PaginationProps {
    className?: string;
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ className, page, onChange, totalPages }) => {
    const handleChange = (next?: number) => {
        if (next !== undefined) {
            if (next >= 0 && next < totalPages) {
                onChange(next);
            }
        }
    };

    return (
        <ReactPaginate
            className={clsx(styles.paginate, className)}
            pageClassName={styles.paginatePage}
            activeClassName={styles.paginatePageActive}
            marginPagesDisplayed={0}
            forcePage={page}
            breakLabel={null}
            pageCount={totalPages}
            onClick={({ nextSelectedPage }) => handleChange(nextSelectedPage)}
            previousLabel={<NavButton onClick={() => handleChange(page - 1)} />}
            nextLabel={<NavButton variant="next" onClick={() => handleChange(page + 1)} />}
        />
    );
};

export default Pagination;
