import { memo, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import clsx from 'clsx';
import routes from 'root/router/routes';
import {
    changeProfilePicture,
    changeStreamId,
    changeUserName,
    selectActiveDao,
    selectProfilePicture,
} from 'store/features/common/slice';
import { selectUserData } from 'store/features/user/slice';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Notification from 'ui/SVG/Notification';
import Settings from 'ui/SVG/Settings';
import { getMemberId } from 'utils/utils';
import styles from './Header.module.scss';
import { toggleMenu } from 'store/features/app/slice';

interface HeaderProps {
    className?: string;
    title?: string | (() => JSX.Element);
    hello?: boolean;
}

const Header: React.FC<HeaderProps> = memo(({ title, className, hello }) => {
    const memberId = getMemberId();
    const [fetchUserProfile, { data }] = useGetMemberByIdMutation({
        fixedCacheKey: memberId,
    });
    const [userName, setUserName] = useState<string>('');
    const dispatch = useTypedDispatch();
    const user = useTypedSelector(selectUserData);
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const profilePicture = useTypedSelector(selectProfilePicture);

    const AfterFetch = (res: any) => {
        setUserName(res.data?.member?.name || '');
        dispatch(
            changeProfilePicture({
                profilePicture: res.data?.member?.profile_picture || '',
            })
        );
        dispatch(
            changeStreamId({
                streamId: res.data?.member?.ceramic_stream || '',
            })
        );
        dispatch(
            changeUserName({
                userName: res.data?.member?.username || '',
            })
        );
    };

    useEffect(() => {
        const localData = localStorage.getItem('signUp');
        const parsedData = JSON.parse(localData!);
        const id = parsedData.member_id;
        if (data) {
            AfterFetch(data);
        } else {
            fetchUserProfile({
                member: { type: 'member_id', value: id },
            })
                .unwrap()
                .then((res) => {
                    AfterFetch(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, []);

    return (
        <header className={clsx(styles.root, className)}>
            <div className={`container ${styles.container}`} data-role="header-container">
                <h2 className={styles.hello}>
                    {hello
                        ? `Welcome, ${userName} 👋`
                        : typeof title === 'function'
                        ? title()
                        : title}
                </h2>
                <a href="https://samudai.xyz" className={styles.logo}>
                    <img src={require('images/logo.png')} alt="logo" />
                </a>
                <div className={styles.bar}>
                    <div className={styles.control}>
                        <NavLink
                            className={clsx(styles.controlBtn)}
                            to={'/' + daoid + routes.notifications + '/general'}
                        >
                            <div className={styles.controlBtnWrap}>
                                <Notification />
                            </div>
                        </NavLink>
                        <NavLink
                            to={'/' + getMemberId() + '/settings/contributor'}
                            className={styles.controlBtn}
                        >
                            <div className={styles.controlBtnWrap}>
                                <Settings />
                            </div>
                        </NavLink>
                    </div>
                    <div className={styles.user}>
                        <NavLink
                            to={routes.profile.replace(':memberid', getMemberId())}
                            className={styles.userImg}
                        >
                            <img
                                src={profilePicture ? profilePicture : '/img/icons/user-4.png'}
                                alt="avatar"
                            />
                        </NavLink>
                    </div>
                </div>
                <button className={styles.burgermenu} onClick={() => dispatch(toggleMenu(true))}>
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </header>
    );
});

Header.displayName = 'Header';

export default Header;
