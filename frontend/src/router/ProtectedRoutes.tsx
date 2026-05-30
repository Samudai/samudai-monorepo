import { Outlet, useParams } from 'react-router-dom';
import { Web3Provider } from '@ethersproject/providers';
import '@samudai_xyz/gateway-consumer-types';
import { selectProvider } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import Login from 'pages/onboarding/ConnectWallet';
import { IRoute } from './types';

const useAuth = (providerEth: Web3Provider | null) => {
    const jwt = localStorage.getItem('jwt');
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    return !!jwt && !!providerEth && !!member_id;
};

// This function will be called when the specific route is entered
const handleRouteEnter = (route: IRoute, daoid: string) => {
    console.log(`Entered the ${route?.meta?.name} route, daoid: ${daoid}`);
    // Perform any necessary actions or function calls

    window.analytics.page(`${route?.meta?.name}`, {
        dao_id: daoid,
    });
};

const ProtectedRoutes = () => {
    const providerEth: Web3Provider | null = useTypedSelector(selectProvider);
    const isAuth = useAuth(providerEth);
    return isAuth ? <Outlet /> : <Login />;
};

export const RoutesWithEnter = ({ route }: { route: IRoute }) => {
    const { daoid } = useParams();
    handleRouteEnter(route, daoid || ''); // Call the function when the route is entered
    return <Outlet />;
};

export default ProtectedRoutes;
