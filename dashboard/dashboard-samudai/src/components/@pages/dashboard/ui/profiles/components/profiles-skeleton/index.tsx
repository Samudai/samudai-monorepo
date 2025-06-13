import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './profiles-skeleton.module.scss';

export const ProfilesSkeleton: React.FC = () => {
    const settings: SwiperProps = {
        slidesPerView: 4,
        allowTouchMove: false,
    };
    return (
        <div className={styles.root}>
            <Swiper className={styles.container} {...settings}>
                {Array.from({ length: 4 }).map((_, id) => (
                    <SwiperSlide className={styles.slide} key={id}>
                        <Skeleton.Block className={styles.card} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
