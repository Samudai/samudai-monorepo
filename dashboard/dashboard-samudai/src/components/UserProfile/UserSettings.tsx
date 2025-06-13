import { useTypedSelector, useTypedDispatch } from 'hooks/useStore';
import { selectUserData } from 'store/features/user/slice';
import { userToggleJobs, userTogglePrivate } from 'store/features/user/slice';
import clsx from 'clsx';
import Switch from 'ui/Switch/Switch';
import styles from './styles/UserSettings.module.scss';

const UserSettings: React.FC = () => {
    const user = useTypedSelector(selectUserData);
    const dispatch = useTypedDispatch();

    const toggleJobs = () => {
        dispatch(userToggleJobs());
    };

    const togglePrivate = () => {
        dispatch(userTogglePrivate());
    };

    return user ? (
        <ul className={styles.root}>
            <li className={clsx(styles.item, { [styles.active]: user.open_for_jobs })}>
                <p className={styles.name}>Open for Jobs</p>
                <Switch active={user.open_for_jobs} onClick={toggleJobs} />
            </li>
            <li className={clsx(styles.item, { [styles.active]: user.private })}>
                <p className={styles.name}>Public View</p>
                <Switch active={user.private} onClick={togglePrivate} />
            </li>
        </ul>
    ) : null;
};

export default UserSettings;
