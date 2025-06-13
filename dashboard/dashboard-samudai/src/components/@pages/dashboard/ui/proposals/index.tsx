import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProposalsDetails } from './components/proposals-details';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { Snapshot } from '@samudai_xyz/web3-sdk';
import { selectAccessList, selectActiveDao, selectProvider } from 'store/features/common/slice';
import { useLazyGetDaoByDaoIdQuery } from 'store/services/Dao/dao';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import ConnectSnapshot from 'components/@pages/settings/connects/ConnectSnapshot';
import styles1 from 'components/@pages/settings/styles/IntegrationsConnectItem.module.scss';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Button from 'ui/@buttons/Button/Button';
import { ProposalsPopup } from './components';
import { ProposalsView } from './components';
import './proposals.scss';
import { toast } from 'utils/toast';

export const Proposals: React.FC = () => {
    const proposalsPopup = usePopup();
    const connectSnapshot = usePopup();
    const detailsPopup = usePopup();
    const [getDao] = useLazyGetDaoByDaoIdQuery();
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const providerEth = useTypedSelector(selectProvider);
    const [selectedProposal, setSelectedProposal] = useState<any>(null);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const [data, setData] = useState<any[]>([]);
    const [loading1, setLoading1] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const fetchData = async function () {
        setLoading1(true);
        const chainId: number = await providerEth!.getNetwork().then((network) => network.chainId);

        // const localData = localStorage.getItem('signUp');
        // const parsedData = !!localData && JSON.parse(localData);
        // const member_id = !!parsedData && parsedData.member_id;
        const response = await getDao(daoid!).unwrap();
        const daoData = response?.data?.dao;
        if (daoData?.snapshot) {
            setIsConnected(true);
        }
        const snap = new Snapshot(daoData?.snapshot || '');
        localStorage.setItem('daoData', daoData?.snapshot || '');
        const recentVal = await snap.getRecentProposals();
        setData(recentVal.data.proposals);
        setLoading1(false);
    };

    const emptyPopupMessage = () => {
        toast(
            'Attention',
            5000,
            'No Proposals in Progress',
            'There are no proposals in progress.'
        )();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleView = (item: any) => {
        setSelectedProposal(item);
        detailsPopup.open();
    };

    return (
        <React.Fragment>
            <Block
                className="proposals orange-scrollbar"
                data-analytics-parent="recent_proposals_widget"
            >
                <Block.Header className="proposals__header">
                    <Block.Title>Recent Proposals</Block.Title>
                    <div style={{ display: 'flex' }}>
                        <Block.Link
                            className="proposals__header-link"
                            onClick={data.length ? proposalsPopup.open : emptyPopupMessage}
                            data-analytics-click="proposals_widget_expand_link"
                        />
                    </div>
                </Block.Header>
                {data.length > 0 ? (
                    <ul className="orange-scrollbar ul">
                        {data.map((item, index) => {
                            return (
                                <ProposalsView
                                    key={index}
                                    title={`${item.title}`}
                                    id={item.id}
                                    status={
                                        item.state === 'pending'
                                            ? 'Pending'
                                            : item.state === 'closed'
                                            ? 'Closed'
                                            : item.state === 'active'
                                            ? 'Active'
                                            : item.state
                                    }
                                    onDetails={() => handleView(item)}
                                />
                            );
                        })}
                    </ul>
                ) : access ? (
                    <div className="prop-empty">
                        <img className="prop-empty__img" src="/img/poll.svg" alt="snapshot" />

                        {isConnected ? (
                            <p className="prop-empty__text">
                                <span>You have no recent proposals.</span>
                            </p>
                        ) : (
                            <>
                                <p className="prop-empty__text">
                                    <span>Connect your Snapshot.</span>
                                </p>

                                <Button
                                    className="prop-empty__connectBtn"
                                    data-analytics-click="connect_snapshot"
                                    color="orange-outlined"
                                    onClick={connectSnapshot.open}
                                >
                                    <span>Connect Snapshot</span>
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="prop-empty">
                        <img className="prop-empty__img" src="/img/poll.svg" alt="snapshot" />

                        <p className="prop-empty__text">
                            {isConnected ? (
                                <span>You have no recent proposals.</span>
                            ) : (
                                <span>Ask your Admin to Connect Snapshot.</span>
                            )}
                        </p>
                    </div>
                )}
            </Block>
            <ProposalsPopup
                active={proposalsPopup.active}
                onClose={proposalsPopup.close}
                data={data.length > 0 ? data : []}
            />
            <PopupBox active={connectSnapshot.active} onClose={connectSnapshot.close}>
                <Popup className={styles1.popup} dataParentId="connect_snapshot_modal">
                    <ConnectSnapshot fetch1={fetchData} onCloseModal={connectSnapshot.close} />
                </Popup>
            </PopupBox>
            <PopupBox active={detailsPopup.active} onClose={detailsPopup.close}>
                <ProposalsDetails
                    createAvailable={false}
                    onClose={detailsPopup.close}
                    data={selectedProposal}
                />
            </PopupBox>
        </React.Fragment>
    );
};
