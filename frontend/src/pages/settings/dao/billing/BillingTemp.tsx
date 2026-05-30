import { useEffect } from 'react';
import Loader from 'components/Loader/Loader';
import styles from 'styles/pages/pipeline-form.module.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTypedDispatch } from 'hooks/useStore';
import { parseTime } from 'utils/format';
import { changeBillingTerm, changeBillingTier, changeUrl } from 'store/features/common/slice';
import { useLogout, usePrivy } from '@privy-io/react-auth';
import { fetchUser } from 'store/features/user/async';

require('dotenv').config();

function BillingTemp() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem('access_token');
    const isTimeoutToken = token && Date.now() - +token > parseTime('3d');
    const isRequestAuth = !token;

    const { ready, authenticated } = usePrivy();
    const { logout } = useLogout({
        onSuccess: () => {
            navigate('/login');
        },
    });

    useEffect(() => {
        const priceTier = searchParams.get('tier');
        const billingTerm = searchParams.get('billing');

        if (!priceTier && !billingTerm) {
            setTimeout(() => {
                localStorage.setItem('billing-status', 'success');
                window.opener === null;
                window.close();
            }, 2000);
        } else {
            priceTier && dispatch(changeBillingTier({ tier: priceTier }));
            billingTerm && dispatch(changeBillingTerm({ billing: billingTerm }));

            if (isRequestAuth || isTimeoutToken) {
                if (ready && authenticated) {
                    logout();
                } else {
                    navigate('/login');
                }
            } else {
                dispatch(fetchUser());
                const url = window.location.href.replace(window.location.origin, '');
                dispatch(changeUrl({ url: url }));
                navigate('/check');
            }
        }
    }, []);

    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
}

export default BillingTemp;
