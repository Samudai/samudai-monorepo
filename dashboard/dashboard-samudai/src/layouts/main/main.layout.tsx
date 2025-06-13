// import styles from './main.layout.module.scss';
import React, { Suspense, useEffect } from 'react';
import clsx from 'clsx';
import { IRoute } from 'root/router/types';
import { fetchProjects } from 'store/features/projects/async';
import { selectUserData } from 'store/features/user/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import Header from 'components/new-header';
import Sidebar from 'components/new-sidebar';
import styles from './main-layout.module.scss';

interface MainLayoutProps {
    component: IRoute['component'];
    headerOff?: boolean;
    sidebarOff?: boolean;
    sidebar: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    headerOff,
    sidebarOff,
    sidebar,
    component: Component,
}) => {
    const user = useTypedSelector(selectUserData);
    const dispatch = useTypedDispatch();

    useEffect(() => {
        if (!user) return;
        dispatch(fetchProjects());
    }, [user]);

    return (
        <div className={clsx(styles.root, sidebar && styles.rootSidebar)}>
            {!sidebarOff && <Sidebar />}
            <div className={styles.content} id="app-content">
                {!headerOff && <Header />}
                <Suspense fallback={<Loader />}>
                    <Component />
                </Suspense>
            </div>
        </div>
    );
};

export default MainLayout;
