import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import { useLazySearchMemberByDaoQuery } from 'store/services/Search/Search';
import useRequest from 'hooks/useRequest';
import Block from 'components/Block/Block';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import { ProfilesItem } from './components';
import './profiles.scss';

export const Profiles: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiper, setSwiper] = useState<SwiperCore | null>(null);
    const [data, setData] = useState<any[]>([]);
    const { daoid } = useParams();
    const [getDiscoveryMember] = useLazySearchMemberByDaoQuery();
    const settings: SwiperProps = {
        // loop: true,
        slidesPerView: 2,
        allowTouchMove: false,
        modules: [Navigation],
        navigation: {
            prevEl: '.cb-profiles__controls_prev',
            nextEl: '.cb-profiles__controls_next',
        },
        onInit: setSwiper,
        breakpoints: {
            566: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            },
        },
        onActiveIndexChange: (swiper) => setActiveIndex(swiper.activeIndex),
    };

    const [fetchData, loading] = useRequest(async function () {
        const res = await getDiscoveryMember({ daoId: daoid!, value: '' }).unwrap();
        setData([...(res.data || [])]);
    });

    useEffect(() => {
        fetchData();
    }, [daoid]);

    useEffect(() => {
        swiper?.update();
    }, [data]);

    const windowWidth = window.innerWidth;

    const slidesLength = Math.max(
        1,
        swiper ? data.length + 1 - (windowWidth < 566 ? 2 : windowWidth < 992 ? 3 : 4) : 1
    );

    return (
        <Block className="cb-profiles" data-analytics-parent="contributor_profiles_widget">
            <Block.Header>
                <Block.Title>Contributor Profiles</Block.Title>
                <div className="cb-profiles__controls">
                    <NavButton className="cb-profiles__controls_prev" disabled={loading} />
                    <NavButton
                        className="cb-profiles__controls_next"
                        disabled={loading}
                        variant="next"
                    />
                </div>
            </Block.Header>
            <Block.Scrollable>
                {/* <Skeleton
          className="cb-profiles__slider"
          loading={loading}
          skeleton={<ContributorProfilesSkeleton />}
        > */}
                <div style={{ marginTop: '20px' }}>
                    {data && data.length > 0 ? (
                        <Swiper className="cb-profiles__swiper" {...settings}>
                            {data.map((item) => (
                                <SwiperSlide
                                    className="cb-profiles__swiper-slide"
                                    key={item?.member_id}
                                >
                                    <ProfilesItem {...item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="prof-empty">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <span className="prof-empty__block" key={index} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="cb-profiles__nav">
                    <div className="cb-profiles__nav-left">
                        <button
                            className="cb-profiles__nav-btn"
                            onClick={() => swiper?.slideTo(0)}
                            disabled={swiper?.isBeginning}
                            data-analytics-click="contributor_profiles_nav_left0_button"
                        >
                            <ArrowLeftIcon />
                            <ArrowLeftIcon />
                        </button>
                        <button
                            className="cb-profiles__nav-btn"
                            onClick={() => swiper?.slidePrev()}
                            disabled={swiper?.isBeginning}
                            data-analytics-click="contributor_profiles_nav_left_button"
                        >
                            <ArrowLeftIcon />
                        </button>
                    </div>
                    <p className="cb-profiles__nav-screen">
                        {activeIndex + 1} of {slidesLength}
                    </p>
                    <div className="cb-profiles__nav-right">
                        <button
                            className="cb-profiles__nav-btn"
                            onClick={() => swiper?.slideNext()}
                            disabled={swiper?.isEnd}
                            data-analytics-click="contributor_profiles_nav_right_button"
                        >
                            <ArrowLeftIcon />
                        </button>
                        <button
                            className="cb-profiles__nav-btn"
                            onClick={() => swiper?.slideTo(swiper.slides.length || data.length)}
                            disabled={swiper?.isEnd}
                            data-analytics-click="contributor_profiles_nav_right_len_button"
                        >
                            <ArrowLeftIcon />
                            <ArrowLeftIcon />
                        </button>
                    </div>
                </div>
                {/* </Skeleton> */}
            </Block.Scrollable>
        </Block>
    );
};
