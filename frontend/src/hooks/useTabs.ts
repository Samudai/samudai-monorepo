import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pathToTab } from 'utils/pathToTab';

const useTabs = (paths: Record<string, string>) => {
    const [activeTab, setActiveTab] = useState<string>('');
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(pathToTab(paths, pathname));
    });

    return { activeTab, navigate };
};

export default useTabs;
