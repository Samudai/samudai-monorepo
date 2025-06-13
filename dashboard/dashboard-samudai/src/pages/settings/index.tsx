import React from 'react';
import { Outlet } from 'react-router-dom';
import { getSettingsRoutes } from './utils/settings-routes';
import SettingsLayout from 'root/layouts/settings/settings.layout';
import Loader from 'components/Loader/Loader';

// import styles from './index.module.scss';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = (props) => {
    return (
        <SettingsLayout routes={getSettingsRoutes}>
            <React.Suspense fallback={<Loader />}>
                <Outlet />
            </React.Suspense>
        </SettingsLayout>
    );
};

export default Settings;
