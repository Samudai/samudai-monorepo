import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';

import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import PaymentsHistory from 'components/@pages/payments/PaymentsHistory';
import PaymentsProviders from 'components/@pages/payments/PaymentsProviders';
import AddPayment from 'components/@pages/payments/popups/AddPayment';
import 'components/@pages/payments/styles/PaymentsSelect.scss';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import Head from 'ui/head';
import './payments.scss';
import { usePayments } from 'utils/payments/use-payments';

const Payments: React.FC = (props) => {
    const { daoid } = useParams();
    const AccessList = useTypedSelector(selectAccessList);
    const activeDao = useTypedSelector(selectActiveDao);
    const accessActiveDao =
        AccessList?.[daoid!]?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
        AccessList?.[daoid!]?.includes(AccessEnums.AccessType.MANAGE_PAYMENT);

    const navigate = useNavigate();
    const addPayment = usePopup();

    const { fetchChainList, fetchDefaultProvider, fetchProviderAndWallets } = usePayments();

    useEffect(() => {
        if (!accessActiveDao || !activeDao) navigate(`/${daoid}/dashboard/1`); // Uncomment
    }, [daoid, activeDao]);

    useEffect(() => {
        fetchChainList();
        fetchProviderAndWallets();
        fetchDefaultProvider();
    }, [daoid]);

    return (
        <div className="page-payments" data-analytics-page="payments">
            <Head breadcrumbs={[{ name: 'Workspace' }, { name: 'Payments' }]}>
                <div className="page-payments__head" data-analytics-parent="payments_header">
                    <Head.Title title="Payments" />

                    <Button
                        onClick={addPayment.open}
                        color="green"
                        data-analytics-click="create_new_payment_btn"
                    >
                        <PlusIcon />
                        <span>New Payment</span>
                    </Button>
                </div>
            </Head>
            <div className="container page-payments__container">
                <div className="page-payments__hr" data-analytics-parent="payments_provider">
                    <PaymentsProviders />
                    {/* <PaymentsWallets /> */}
                </div>
                <div data-analytics-parent="payments_history">
                    <PaymentsHistory />
                </div>
            </div>

            <PopupBox active={addPayment.active} onClose={addPayment.toggle}>
                <AddPayment onClose={addPayment.toggle} />
            </PopupBox>
        </div>
    );
};

export default Payments;
