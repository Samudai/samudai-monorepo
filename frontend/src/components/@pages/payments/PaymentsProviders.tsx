import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';
import { ProviderDetails } from './model/model';
import AddProvider from './popups/AddProvider';
import { Provider } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import {
    addDefaultProvider,
    providerList,
    selectDefaultProvider,
} from 'store/features/payments/paymentsSlice';
import { useLazyGetDefaultProviderQuery } from 'store/services/payments/payments';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import styles1 from 'components/@pages/dashboard/ui/reviews/components/reviews-popup/reviews-popup.module.scss';
import ChangeAddress from 'components/@pages/payments/popups/ChangeAddress';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import NavButton from 'ui/@buttons/NavButton/NavButton';
import PlusIcon from 'ui/SVG/PlusIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import Switch from 'ui/Switch/Switch';
import { cutText } from 'utils/format';
import { toast } from 'utils/toast';
import './styles/PaymentsProviders.scss';
import { usePayments } from 'utils/payments/use-payments';

const MAX_ELEMENTS_PER_PAGE = 5;

const PaymentsProviders: React.FC = () => {
    const [main, setMain] = useState<Provider>({} as Provider);
    const [data, setData] = useState<Provider[]>([]);
    const [is_default, setIs_default] = useState<boolean>(false);
    const [page, setPage] = useState(0);
    const [COUNT_SHOW_PAGES, SET_COUNT_SHOW_PAGES] = useState(
        Math.ceil(data?.length / MAX_ELEMENTS_PER_PAGE)
    );
    const [selectedProvider, setSelectedProvider] = useState<ProviderDetails>(
        {} as ProviderDetails
    );

    const { daoid } = useParams();
    const addProvider = usePopup();
    const changeAddress = usePopup();
    const providers = useTypedSelector(providerList);
    const activeDao = useTypedSelector(selectActiveDao);
    const mainProvider = useTypedSelector(selectDefaultProvider);
    const dispatch = useTypedDispatch();

    const { changeDefaultProvider, handleDeleteProvider } = usePayments();
    const [getDefaultProvider] = useLazyGetDefaultProviderQuery();

    const handleNavPage = (next: number) => {
        const nextPage = page + next;
        if (nextPage <= 0 || nextPage >= COUNT_SHOW_PAGES) return;

        if (nextPage !== 0) {
            setPage(nextPage);
        }
    };

    const handleChangePage = (page?: number) => {
        if (page !== undefined) {
            setPage(page);
        }
    };

    const fetchDefaultProvider = async () => {
        const defaultProviderData = await getDefaultProvider(daoid!, true).unwrap();
        if (defaultProviderData?.data) {
            dispatch(addDefaultProvider(defaultProviderData.data));
        }
    };

    const handleCopyToClipboard = (address: string) => {
        navigator.clipboard.writeText(address);
        return toast('Success', 2000, 'Wallet Address Copied', '')();
    };

    useEffect(() => {
        setData(providers);
    }, [providers, activeDao]);

    useEffect(() => {
        setMain(mainProvider || ({} as Provider));
    }, [mainProvider]);

    return (
        <React.Fragment>
            <div
                className={clsx(
                    'payments-desk payments-desk_providers',
                    data.length === 0 && 'payments-desk__empty'
                )}
            >
                <div className="payments-desk__header">
                    <h3 className="payments-desk__header-title">Added Wallets</h3>
                    <Button
                        className="payments-desk__header-btn"
                        onClick={addProvider.open}
                        data-analytics-click="create_new_provider_btn"
                    >
                        <PlusIcon />
                        <span>Add Wallet</span>
                    </Button>
                </div>
                <ul className={clsx('payments-desk__list')}>
                    {/* {(providerLoader1 || providerLoader2 || providerLoader3 || !isDataLoaded) && (
                        <Loader />
                    )} */}
                    {data.length === 0 ? (
                        <div className="payments-desk__empty-state">
                            <img src="/img/wallet.svg" alt="" />
                            <p>
                                <span>Your Wallet Details</span>
                                <span>Come in Here.</span>
                            </p>
                        </div>
                    ) : (
                        <>
                            {[...data]
                                .sort((a, b) =>
                                    a.provider_id === main?.provider_id
                                        ? -1
                                        : b.provider_id === main?.provider_id
                                        ? 1
                                        : 0
                                )
                                .slice(
                                    page * MAX_ELEMENTS_PER_PAGE,
                                    page * MAX_ELEMENTS_PER_PAGE + MAX_ELEMENTS_PER_PAGE
                                )
                                .map((item) => (
                                    <li className="payments-desk__item" key={item.provider_id}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                            }}
                                        >
                                            <div className="payments-desk__label">
                                                <p className="payments-desk__subtitle">
                                                    {main?.provider_id === item.provider_id &&
                                                        'Primary'}
                                                </p>
                                                <p className="payments-desk__name">
                                                    {cutText(item.name, 15)}
                                                </p>
                                            </div>
                                            <div className="payments-desk__settings">
                                                <SettingsDropdown className="payments-desk__settings-dropdown">
                                                    <SettingsDropdown.Item className="payments-desk__settings-item">
                                                        <span>Default</span>
                                                        <div
                                                            data-analytics-click={
                                                                `default_provider_changed_to` +
                                                                item.provider_id!
                                                            }
                                                            onClick={() => {
                                                                changeDefaultProvider(
                                                                    item.provider_id!
                                                                );
                                                            }}
                                                        >
                                                            <Switch
                                                                className="payments-desk__settings-switch"
                                                                active={
                                                                    main?.provider_id ===
                                                                    item.provider_id
                                                                }
                                                            />
                                                        </div>
                                                    </SettingsDropdown.Item>
                                                    <SettingsDropdown.Item
                                                        className="payments-desk__settings-item"
                                                        onClick={() =>
                                                            handleDeleteProvider(
                                                                item.provider_id!.toString()
                                                            )
                                                        }
                                                    >
                                                        <span
                                                            data-analytics-click={
                                                                `delete_provider` +
                                                                item.provider_id!
                                                            }
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            Delete Provider
                                                        </span>
                                                    </SettingsDropdown.Item>
                                                    <SettingsDropdown.Item
                                                        className="payments-desk__settings-item"
                                                        onClick={() => {
                                                            setIs_default(
                                                                main?.provider_id ===
                                                                    item.provider_id
                                                            );
                                                            setSelectedProvider({
                                                                name: item.name,
                                                                address: item.address,
                                                                id: item.id!,
                                                                chain_id: item.chain_id,
                                                                provider_type: item.provider_type,
                                                            });
                                                            changeAddress.open();
                                                        }}
                                                    >
                                                        <span
                                                            data-analytics-click="provider's_address_change"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            Change address
                                                        </span>
                                                    </SettingsDropdown.Item>
                                                </SettingsDropdown>
                                            </div>
                                        </div>
                                        <div className="payments-desk__address_new">
                                            {item.address}
                                        </div>
                                        {/* <Hint
                                            text={item.address}
                                            className="payments-desk__hint"
                                            maxWidth={600}
                                            margin={2}
                                        >
                                            <button
                                                className="payments-desk__address"
                                                onClick={() => handleCopyToClipboard(item.address)}
                                            >
                                                <CopyIcon />
                                                <span>
                                                    {item.address.slice(0, 5) +
                                                        '...' +
                                                        item.address.slice(63)}
                                                </span>
                                            </button>
                                        </Hint> */}
                                    </li>
                                ))}
                        </>
                    )}
                </ul>
                {data.length > MAX_ELEMENTS_PER_PAGE && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                        <ReactPaginate
                            className={styles1.paginate}
                            pageClassName={styles1.paginatePage}
                            activeClassName={styles1.paginatePageActive}
                            pageCount={Math.ceil(data?.length / MAX_ELEMENTS_PER_PAGE)}
                            forcePage={page}
                            marginPagesDisplayed={0}
                            pageRangeDisplayed={Math.ceil(data?.length / MAX_ELEMENTS_PER_PAGE)}
                            breakLabel={false}
                            onClick={({ nextSelectedPage }) => handleChangePage(nextSelectedPage)}
                            previousLabel={<NavButton onClick={() => handleNavPage(-1)} />}
                            nextLabel={
                                <NavButton variant="next" onClick={() => handleNavPage(1)} />
                            }
                        />
                    </div>
                )}
            </div>
            <PopupBox active={addProvider.active} onClose={addProvider.close}>
                <AddProvider onClose={addProvider.close} />
            </PopupBox>
            <PopupBox active={changeAddress.active} onClose={changeAddress.close}>
                <ChangeAddress
                    onClose={changeAddress.close}
                    selectedProvider={selectedProvider}
                    is_default={is_default}
                />
            </PopupBox>
        </React.Fragment>
    );
};

export default PaymentsProviders;
