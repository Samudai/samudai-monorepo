import React from 'react';
import { selectStreamId } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import { useFetchBadges } from 'components/@pages/new-profile/lib/hooks';
import { Skeleton } from 'components/new-skeleton';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';
import css from './profile-badges.module.scss';

export const ProfileBadges: React.FC = () => {
    const { data, isMyProfile, loading } = useFetchBadges();
    const streamId = useTypedSelector(selectStreamId);

    const handleClick = () => {
        if (!streamId) {
            return toast(
                'Failure',
                5000,
                'No verifiable credentials claimed on this platform',
                ''
            )();
        }
        window.open('https://cerscan.com/mainnet/stream/' + streamId, '_blank');
    };

    if (loading) {
        return (
            <Skeleton
                styles={{
                    height: 76,
                    borderRadius: 17,
                }}
            />
        );
    }

    if (data.length === 0) {
        return (
            <div className={css.badges}>
                <ul className={css.empty}>
                    <li className={css.empty_item} />
                    <li className={css.empty_item} />
                    <li className={css.empty_item} />
                    <li className={css.empty_item} />
                    <li className={css.empty_item} />
                    <li className={css.empty_item} />
                    <li className={css.empty_item} />
                    {isMyProfile ? (
                        <>
                            <li className={css.empty_text}>
                                <p>Your Badges Appear Here</p>
                            </li>
                            <li className={css.empty_btn}>
                                <Button
                                    className={css.credentials_btn}
                                    color="orange"
                                    onClick={handleClick}
                                    data-analytics-click="credentials_button"
                                >
                                    <Sprite url="/img/sprite.svg#mark-border" />
                                    <span>Credentials</span>
                                </Button>
                            </li>
                        </>
                    ) : (
                        <li className={css.empty_text}>
                            <p>Credentials are not Added.</p>
                        </li>
                    )}
                </ul>
            </div>
        );
    }

    return (
        <div className={css.badges}>
            <ul className={css.list}>
                {data.slice(0, 10).map((item, index) => (
                    <li className={css.list_item} key={index}>
                        <div className={css.badge}>
                            <div className={css.badge_icon}>
                                <img
                                    src={item.icon || '/mockup/img/badge.svg'}
                                    alt="icon"
                                    className="img-cover"
                                />
                            </div>

                            <p className={css.badge_count}>{1}</p>
                        </div>
                    </li>
                ))}

                {data.length > 10 && (
                    <li className={css.list_item}>
                        <div className={css.badge}>
                            <div className={css.badge_bordered}>
                                <span>+5</span>
                            </div>

                            <p className={css.badge_count}>More</p>
                        </div>
                    </li>
                )}

                <li className={css.list_item}>
                    <Button
                        className={css.credentials_btn}
                        color="orange"
                        onClick={handleClick}
                        data-analytics-click="credentials_button"
                    >
                        <Sprite url="/img/sprite.svg#mark-border" />
                        <span>Credentials</span>
                    </Button>
                </li>
            </ul>
        </div>
    );
};
