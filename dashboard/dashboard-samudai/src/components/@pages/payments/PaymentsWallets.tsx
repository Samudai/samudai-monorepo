import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProviderDetails } from './model/model';
import { Provider, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao } from 'store/features/common/slice';
import { walletList } from 'store/features/payments/paymentsSlice';
import {
    useAddProviderMutation,
    useChangeDefaultMutation,
    useDeleteProviderMutation,
    useGetProviderQuery,
} from 'store/services/payments/payments';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import AddWallet from 'components/@pages/payments/popups/AddWallet';
import ChangeAddress from 'components/@pages/payments/popups/ChangeAddress';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import styles from 'components/UserProfile/styles/UserControls.module.scss';
import Button from 'ui/@buttons/Button/Button';
import CopyIcon from 'ui/SVG/CopyIcon';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import Switch from 'ui/Switch/Switch';
import Hint from 'ui/hint/hint';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import './styles/PaymentsWallets.scss';
import sendNotification from 'utils/notification/sendNotification';

const PaymentsWallets: React.FC = () => {
    const addWallet = usePopup();
    const { daoid } = useParams();
    const changeAddress = usePopup();
    const wallets = useTypedSelector(walletList);
    const activeDao = useTypedSelector(selectActiveDao);
    const [addProviderApi, { isSuccess, isLoading: providerLoader1 }] = useAddProviderMutation();
    const { refetch } = useGetProviderQuery(daoid!);
    const [deleteProvider, { isLoading: providerLoader2 }] = useDeleteProviderMutation();
    const [changeDefault, { isLoading: providerLoader3 }] = useChangeDefaultMutation();

    const mainWallet = (wallets: Provider[]) =>
        wallets.filter((item) => item.is_default === true)[0];
    const [main, setMain] = useState<Provider>({} as Provider);
    const [data, setData] = useState<Provider[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<ProviderDetails>({} as ProviderDetails);
    const [is_default, setIs_default] = useState<boolean>(false);

    const handleAddWallet = (wallet: {
        provider_type: string;
        chain_id: number;
        address: string;
        name: string;
    }) => {
        const payload = {
            ...wallet,
            dao_id: daoid!,
            created_by: getMemberId(),
            is_default: wallets.length === 0,
        };
        console.log({ provider: payload });
        addProviderApi({ provider: payload })
            .unwrap()
            .then((res) => {
                if (res?.data?.provider_id) {
                    sendNotification({
                        to: [daoid!],
                        for: NotificationsEnums.NotificationFor.ADMIN,
                        from: getMemberId(),
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: res.data.provider_id,
                            redirect_link: `/${daoid!}/payments`,
                        },
                        type: NotificationsEnums.SocketEventsToServicePayment.PROVIDER_ADDED,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        // setData([...data, wallet]);
    };

    const handleCopyToClipboard = (address: string) => {
        navigator.clipboard.writeText(address);
        return toast('Success', 2000, 'Wallet Address Copied', '')();
    };

    useEffect(() => {
        setData(wallets);
        setMain(mainWallet(wallets));
    }, [wallets, daoid]);

    return (
        <React.Fragment>
            <div className="payments-desk payments-desk_wallets">
                <div className="payments-desk__header">
                    <h3 className="payments-desk__header-title">Added Wallets</h3>
                    <Button className="payments-desk__header-btn" onClick={addWallet.open}>
                        <span>Add Wallets</span>
                    </Button>
                </div>
                <ul className="payments-desk__list">
                    {providerLoader1 || providerLoader2 || providerLoader3 ? (
                        <Loader />
                    ) : (
                        data.map((item: Provider) => (
                            <li className="payments-desk__item" key={item.id}>
                                <Hint text={item.address} maxWidth={600} margin={2}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <div className="payments-desk__label">
                                            {/* <div className="payments-desk__icon">
                      <img src={'/img/providers/gnosis.svg'} alt="provider" />
                    </div> */}
                                            <p className="payments-desk__name">{item.name}</p>
                                        </div>
                                        <button
                                            className={styles.claimBtn}
                                            style={{
                                                background: '#52585E',
                                                justifyContent: 'center',
                                                padding: '7px',
                                                font: '600 12px/1.43 "Lato", sans-serif',
                                                maxWidth: '100px',
                                                minWidth: '100px',
                                                marginLeft: '12px',
                                                boxShadow: '0px 3px 8px rgb(19 19 20 / 20%)',
                                            }}
                                            onClick={() => handleCopyToClipboard(item.address)}
                                        >
                                            <CopyIcon />
                                            <span>
                                                {item.address.slice(0, 5) +
                                                    '...' +
                                                    item.address.slice(63)}
                                            </span>
                                        </button>
                                    </div>
                                </Hint>
                                <div className="payments-desk__settings">
                                    <SettingsDropdown className="payments-desk__settings-dropdown">
                                        <SettingsDropdown.Item className="payments-desk__settings-item">
                                            <span>Default</span>
                                            <div
                                                onClick={() => {
                                                    changeDefault({
                                                        providerId: item.provider_id!,
                                                        daoId: daoid!,
                                                    });
                                                }}
                                            >
                                                <Switch
                                                    className="payments-desk__settings-switch"
                                                    active={main?.provider_id === item.provider_id}
                                                />
                                            </div>
                                        </SettingsDropdown.Item>
                                        <SettingsDropdown.Item className="payments-desk__settings-item">
                                            <span
                                                onClick={() =>
                                                    deleteProvider(item.provider_id!)
                                                        .unwrap()
                                                        .then((res) => console.log(res))
                                                        .catch((err) => console.error(err))
                                                }
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Delete Wallet
                                            </span>
                                        </SettingsDropdown.Item>
                                        <SettingsDropdown.Item className="payments-desk__settings-item">
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setIs_default(
                                                        main?.provider_id === item.provider_id
                                                    );
                                                    setSelectedWallet({
                                                        id: item.id!,
                                                        name: item.name,
                                                        address: item.address,
                                                        chain_id: item.chain_id,
                                                        provider_type: item.provider_type,
                                                    });
                                                    changeAddress.open();
                                                }}
                                            >
                                                Change address
                                            </span>
                                        </SettingsDropdown.Item>
                                    </SettingsDropdown>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <PopupBox active={addWallet.active} onClose={addWallet.close}>
                <AddWallet onSubmit={handleAddWallet} onClose={addWallet.close} />
            </PopupBox>
            <PopupBox active={changeAddress.active} onClose={changeAddress.close}>
                <ChangeAddress
                    onClose={changeAddress.close}
                    selectedProvider={selectedWallet}
                    is_default={is_default}
                />
            </PopupBox>
        </React.Fragment>
    );
};

export default PaymentsWallets;
