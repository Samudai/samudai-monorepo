import React from 'react';
import { Stars } from 'ui/stars';
import css from './dao-reviews-item.module.scss';
import { ReviewResponse } from '@samudai_xyz/gateway-consumer-types';

interface DaoReviewsItemProps {
    data: ReviewResponse;
}

export const DaoReviewsItem: React.FC<DaoReviewsItemProps> = ({ data }) => {
    return (
        <div className={css.review}>
            <div className={css.img}>
                <img
                    src={data.member.profile_picture || '/img/icons/user-4.png'}
                    alt="user"
                    className="img-cover"
                />
            </div>

            <div className={css.content}>
                <h5 className={css.name}>{data.member?.name}</h5>

                <Stars rate={data?.rating} className={css.stars} colorActive="#FDC087" />

                <p className={css.text}>{data?.content}</p>
            </div>
        </div>
    );
};
