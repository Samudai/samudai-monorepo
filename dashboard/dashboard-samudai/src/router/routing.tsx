import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Web3Modal from 'web3modal';
import MainLayout from 'root/layouts/main/main.layout';
import PublicPage from 'pages/public/public-page';
import { changeUrl, selectUrl } from 'store/features/common/slice';
import { selectUserData } from 'store/features/user/slice';
import useLogin from 'hooks/useLogin';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import CheckFile from 'utils/CheckFile';
import ProtectedRoutes from './ProtectedRoutes';
import { router } from './routes';
import { publicRouter } from './publicRoutes';
import checkIfValidUUID from 'utils/checkIfValidUUID';
import { parseTime } from 'utils/format';
import routes from 'root/router/routes';
import { fetchUser } from 'store/features/user/async';
import { usePrivy, useLogout } from '@privy-io/react-auth';

const BotsTemp = React.lazy(() => import('pages/DiscordTemp/BotsTemp'));
const DiscordTemp = React.lazy(() => import('pages/DiscordTemp/DiscordTemp'));
const BillingTemp = React.lazy(() => import('pages/settings/dao/billing/BillingTemp'));
const ReDiscord = React.lazy(() => import('pages/DiscordTemp/ReDiscord'));
const GCalDao = React.lazy(() => import('pages/Gcal/GcalDao'));
const GCalUser = React.lazy(() => import('pages/Gcal/GcalUser'));
const GithubOrg = React.lazy(() => import('pages/GitHub/GithubOrg'));
const GithubUser = React.lazy(() => import('pages/GitHub/GithubUser'));
const Invite = React.lazy(() => import('pages/Invite/Invite'));
const InviteMember = React.lazy(() => import('pages/Invite/InviteMember'));
const MemberDao = React.lazy(() => import('pages/Invite/MemberDao'));
const Login = React.lazy(() => import('pages/Login/Login'));
const Notion = React.lazy(() => import('pages/Notion/Notion'));
const PipelineFormPage = React.lazy(() => import('pages/pipeline-form'));
const Onboarding = React.lazy(() => import('pages/onboarding'));
const ConnectWallet = React.lazy(() => import('pages/onboarding/ConnectWallet'));
const OnboardingEnables = React.lazy(() => import('pages/enables'));
const Redirection = React.lazy(() => import('pages/Redirection/Redirection'));

// const SignUp = React.lazy(() => import('pages/sign-up/SignUp'));

const Routing = () => {
    const user = useTypedSelector(selectUserData);
    const navigate = useNavigate();
    const { checkAuth } = useLogin();
    const web3Modal = new Web3Modal({ cacheProvider: true });
    const urlLoad = useTypedSelector(selectUrl);
    const dispatch = useTypedDispatch();
    const [URL, setURL] = useState<string>(urlLoad!);
    const { connector: activeConnector, isConnected } = useAccount();
    const { ready, authenticated } = usePrivy();
    const [searchParams, setSearchParams] = useSearchParams();

    const token = localStorage.getItem('access_token');
    const isTimeoutToken = token && Date.now() - +token > parseTime('3d');
    const isRequestAuth = !token;

    const { logout } = useLogout({
        onSuccess: () => {
            navigate('/login');
        },
    });

    useEffect(() => {
        const locationCheck = [
            '/gcaluser',
            '/gcaldao',
            '/githubuser',
            '/githuborg',
            '/notion',
            '/discord',
            '/rediscord',
            '/bot',
            '/billing',
        ];
        let url = window.location.href.replace(window.location.origin, '');
        const path = url.split('/');
        const check = async () => {
            if (locationCheck.some((val) => window.location.pathname.includes(val))) {
                if (!window.location.pathname.includes('/billing-stripe')) return;
            }
            if (!urlLoad) {
                if (url === '/' || url === '/login' || url === '/signup' || url === '/') {
                    url = '/dashboard/1';
                } else if (checkIfValidUUID(path[1]) && path[2] === 'profile') {
                    url = `/${path[1]}/profile`;
                }
                dispatch(changeUrl({ url: url }));
                setURL(url);
            }
            navigate('/check');
        };

        const query = searchParams.get('query');
        console.log(query);
        if (path[1].includes('login') && query === 'samudaiXCaster') {
            localStorage.setItem('samudaiXCaster', 'true');
        }

        if (path[1].includes('privy_oauth_code')) {
            return;
        } else if (isRequestAuth || isTimeoutToken) {
            localStorage.removeItem('access_token');

            if (ready && authenticated) {
                logout();
            } else if (checkIfValidUUID(path[1]) && path[2] === 'profile') {
                navigate(`/${path[1]}/profile/public`);
            } else if (path[1].includes('redirect')) {
                navigate(window.location.pathname);
            } else {
                navigate(routes.login);
            }
        } else if (window.location.pathname.split('/')[2] === 'form') {
            navigate(window.location.pathname);
        } else {
            dispatch(fetchUser());
            check();
        }
    }, []);

    // useEffect(() => {
    //     checkAuth();
    // }, []);

    const filteredRoutes = router.filter((route) => {
        if (user && route.access.includes('authorization')) return false;

        // For development ↓
        if (route.path === '*') return true;

        // For production ↓

        // if(!user && !route.access.includes('authorization')) return false;

        // if(route.path === "*" || route.access.length === 0) return true;

        // if(!user) return false;

        // if(!route.access.includes(user.role)) return false;

        return true;
    });

    return (
        <Routes>
            <Route path="/login" element={<ConnectWallet />} />
            <Route path="" element={<Onboarding />} />
            <Route path="/signup" element={<Onboarding />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/loading" element={<OnboardingEnables />} />
            <Route path="/discord" element={<DiscordTemp />} />
            <Route path="/billing" element={<BillingTemp />} />
            <Route path="/rediscord" element={<ReDiscord />} />
            <Route path="/bot" element={<BotsTemp />} />
            <Route path="/githubuser" element={<GithubUser />} />
            <Route path="/notion" element={<Notion />} />
            <Route path="/githuborg" element={<GithubOrg />} />
            <Route path="/gcaluser" element={<GCalUser />} />
            <Route path="/gcaldao" element={<GCalDao />} />
            <Route path="/:formid/form" element={<PipelineFormPage />} />
            <Route path="/check" element={<CheckFile />} />
            <Route path="/invite/project/:inviteid" element={<Invite />} />
            <Route path="/invite/member/:inviteid" element={<InviteMember />} />
            <Route path="/i/dm/:inviteid" element={<MemberDao />} />
            <Route path="/redirect" element={<Redirection />} />
            <Route element={<Outlet />}>
                {publicRouter.map((route) => (
                    <Route
                        path={route.path}
                        element={<PublicPage component={route.component} />}
                        key={route.path}
                    />
                ))}
            </Route>
            <Route element={<ProtectedRoutes />}>
                {filteredRoutes.map((route) => (
                    <Route
                        path={route.path}
                        element={<MainLayout component={route.component} sidebar={route.sidebar} />}
                        key={route.path}
                    >
                        {route.children &&
                            route.children.map(({ component: Comp, ...route }) => (
                                <Route path={route.path} element={<Comp />} key={route.path} />
                            ))}
                    </Route>
                ))}
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default Routing;
