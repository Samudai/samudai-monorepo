import { useLocation, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import { SettingsRoute } from 'pages/settings/utils/settings-routes';
import { SettingsTabs } from 'components/@pages/settings/settings-tabs';
import Head from 'ui/head';
import { getMemberId } from 'utils/utils';
import styles from './settings.layout.module.scss';

interface SettingsLayoutProps {
    routes: (daoid?: string, memberId?: string) => SettingsRoute[];
    breadcrumbsComp?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
    routes,
    children,
    className,
    breadcrumbsComp,
}) => {
    const { daoid } = useParams();
    const location = useLocation();
    const router = routes(daoid, getMemberId());
    const activeDao = useTypedSelector(selectActiveDao);
    const access = useTypedSelector(selectAccessList)?.[activeDao!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const currentRoute = router.find((route) =>
        new RegExp(route.baseUrl, 'i').test(location.pathname)
    );
    return !currentRoute ? null : (
        <div className={clsx(styles.root, className)}>
            <Head
                classNameRoot={styles.breadcrumbs}
                breadcrumbs={[{ name: 'Settings' }, { name: currentRoute.name }]}
                breadcrumbsComp={breadcrumbsComp}
            />
            <div className={clsx('container', styles.container)}>
                <div className={styles.layout}>
                    <div className={styles.tabs_wrapper}>
                        <div className={styles.tabs}>
                            <h1 className={styles.title}>Settings</h1>
                            <ul className={styles.tabsList}>
                                <SettingsTabs />
                            </ul>
                        </div>
                    </div>

                    <div className={styles.content}>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
