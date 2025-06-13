import { useNavigate } from 'react-router-dom';
import routes from 'root/router/routes';
import { fetchUser } from 'store/features/user/async';
import { parseTime } from 'utils/format';
import { useTypedDispatch } from './useStore';

const useLogin = () => {
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();

    const checkAuth = () => {
        const token = localStorage.getItem('access_token');
        const isTimeoutToken = token && Date.now() - +token > parseTime('3d');
        const isRequestAuth = !token;
        const url = window.location.href.replace(window.location.origin, '');
        const path = url.split('/');

        if (isRequestAuth || isTimeoutToken) {
            localStorage.removeItem('access_token');
            navigate(routes.login);
        } else {
            dispatch(fetchUser());
        }
    };

    return { checkAuth };
};

export default useLogin;
