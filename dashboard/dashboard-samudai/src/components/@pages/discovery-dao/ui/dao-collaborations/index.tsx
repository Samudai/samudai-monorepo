import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { SwiperOptions } from 'swiper';
import Button from 'ui/@buttons/Button/Button';
import css from './dao-collaborations.module.scss';
import Sprite from 'components/sprite';
import { Skeleton } from 'components/new-skeleton';
import { useNavigate } from 'react-router-dom';
import useFetchDao from 'components/@pages/new-discovery/lib/hooks/use-fetch-dao';
import { getAbbr } from 'utils/getAbbr';

interface DaoCollaborationsProps {}

export const DaoCollaborations: React.FC<DaoCollaborationsProps> = (props) => {
    const [swiperCore, setSwiperCore] = useState<SwiperCore>();

    const { daoData, loading } = useFetchDao();

    const navigate = useNavigate();

    const swiperOptions: SwiperOptions = {
        slidesPerView: 5,
        allowTouchMove: false,
    };

    const nameAbbr = (name: string) => {
        return getAbbr(name, { separator: '_' });
    };

    if (loading) {
        return (
            <div className={css.clb}>
                <Skeleton
                    styles={{
                        height: 92,
                        borderRadius: 16,
                    }}
                />
            </div>
        );
    }

    return (
        <div className={css.clb}>
            <div className={css.head}>
                <h3 className={css.head_title}>Past Collaborations</h3>
                {!!daoData?.collaborations.length && (
                    <div className={css.controls}>
                        <button
                            className={css.controls_btn}
                            onClick={() => swiperCore?.slidePrev()}
                        >
                            <Sprite
                                url="/img/sprite.svg#arrow-right"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                        </button>

                        <button
                            className={css.controls_btn}
                            onClick={() => swiperCore?.slideNext()}
                        >
                            <Sprite url="/img/sprite.svg#arrow-right" />
                        </button>
                    </div>
                )}
            </div>

            <div className={css.content}>
                {!daoData?.collaborations.length && (
                    <div className={css.empty}>
                        <img
                            className={css.empty_img}
                            src="/img/icons/handshake.svg"
                            alt="handshake"
                        />

                        <div className={css.empty_right}>
                            <p className={css.empty_text}>No Collaborations yet.</p>
                            <Button
                                className={css.empty_btn}
                                color="orange-outlined"
                                onClick={() => navigate(`/discovery/dao`)}
                            >
                                <span>Explore DAOs</span>
                            </Button>
                        </div>
                    </div>
                )}

                {!!daoData?.collaborations.length && (
                    <div className={css.collaborations}>
                        <Swiper {...swiperOptions} onInit={setSwiperCore} className={css.swiper}>
                            {daoData?.collaborations?.map((item) => (
                                <SwiperSlide className={css.swiper_slide} key={item.name}>
                                    <div className={css.item}>
                                        <div className={css.item_img}>
                                            {item?.profile_picture ? (
                                                <img
                                                    src={item.profile_picture}
                                                    alt="logo"
                                                    className="img-cover"
                                                />
                                            ) : (
                                                <span>{nameAbbr(item.name)}</span>
                                            )}
                                        </div>

                                        <p className={css.item_name}>{item.name}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
};
