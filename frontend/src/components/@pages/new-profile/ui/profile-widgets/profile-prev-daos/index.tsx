import { useProfile } from 'components/@pages/new-profile/providers';
import { DaosSkeleton } from '../../profile-skeleton';
import css from './profile-prev-daos.module.scss';
import Sprite from 'components/sprite';
import { ProfileDaoItem } from '../../profile-dao-item';

export const ProfilePrevDaos = () => {
    const { loading, userData } = useProfile();

    const dao_worked_with = userData?.member.dao_worked_with || [];

    if (loading) {
        return <DaosSkeleton />;
    }

    if (dao_worked_with.length === 0) {
        return (
            <div className={css.skel_root}>
                <h3 className={css.title}>
                    <span className={css.title_text}>DAOs previously worked with</span>
                    <button className={css.title_btn}>
                        <Sprite url="/img/sprite.svg#arrow-send" />
                    </button>
                </h3>

                <div className={css.skel_content}>
                    <div className={css.skel_container}>
                        <p className={css.skel_text}>Hasn't worked with any DAO currently.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={css.root}>
            <h3 className={css.title}>
                <span className={css.title_text}>DAOs previously worked with</span>
                <button className={css.title_btn}>
                    <Sprite url="/img/sprite.svg#arrow-send" />
                </button>
            </h3>

            <ul className={css.list}>
                {userData?.member.dao_worked_with.map((item, index) => (
                    <li className={css.list_item} key={index}>
                        <ProfileDaoItem data={item} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
