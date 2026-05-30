import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import clsx from 'clsx';
import { awaitingPaymentObject } from 'store/services/payments/model';
import PaymentsTableItem from './PaymentsTableItem';
import './styles/PaymentsTable.scss';
import { Payment } from '@samudai_xyz/gateway-consumer-types';
import { QueuedTxnObject, HistoryTxnObject } from './PaymentsHistory';

interface PaymentsTableProps {
    className?: string;
    queuedData: QueuedTxnObject[];
    historyData: HistoryTxnObject[];
    upcoming: boolean;
    awaiting: boolean;
    awaitingData?: awaitingPaymentObject[];
    setTemp: Dispatch<SetStateAction<boolean>>;
    temp: boolean;
    selectedTxn?: awaitingPaymentObject[];
    setSelectedTxn?: (value: awaitingPaymentObject[]) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
    queuedData,
    historyData,
    className,
    upcoming,
    awaiting,
    awaitingData,
    setTemp,
    temp,
    selectedTxn,
    setSelectedTxn,
}) => {
    const { daoid } = useParams();
    const [payIds, setPayIds] = useState<Record<string, Payment>>({});

    const handleSelectAll = () => {
        if (awaitingData?.length === selectedTxn?.length) {
            setSelectedTxn?.([]);
        } else if (awaitingData?.length) {
            setSelectedTxn?.(awaitingData);
        }
    };

    const handleSingleSelect = (item: awaitingPaymentObject) => {
        if (selectedTxn?.some((txn) => txn.payout_id === item.payout_id)) {
            setSelectedTxn?.(selectedTxn.filter((txn) => txn.payout_id !== item.payout_id));
        } else {
            setSelectedTxn?.([...(selectedTxn || []), item]);
        }
    };

    const awaitingDataFiltered = useMemo(() => {
        return awaitingData
            ? [...awaitingData!]
                  .sort(
                      (a, b) =>
                          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
                  )
                  .filter((item) => !!item.provider.address)
            : [];
    }, [awaitingData]);

    const queuedDataFiltered = useMemo(() => {
        return queuedData
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .sort((a, b) => (b.inQueue ? 1 : 0) - (a.inQueue ? 1 : 0))
            .filter((item) => item.type !== 'OTHER');
    }, [queuedData]);

    const historyDataFiltered = useMemo(() => {
        return historyData
            .sort(
                (a, b) => new Date(b.executionDate).getTime() - new Date(a.executionDate).getTime()
            )
            .filter((item) => item.type !== 'OTHER');
    }, [historyData]);

    useEffect(() => {
        const fn = async () => {
            const headers = {
                authorization: 'Bearer ' + localStorage.getItem('jwt'),
                daoId: daoid!,
            };

            const payments = await axios.get(
                `${process.env.REACT_APP_GATEWAY}api/payment/get/dao/${daoid}`,
                {
                    headers,
                }
            );

            const a: Record<string, Payment> = {};
            payments.data.data.data.forEach((payment: Payment) => {
                a[payment.safe_transaction_hash] = payment;
            });
            setPayIds(a);
        };
        fn();
    }, [daoid]);

    return (
        <div className={clsx('payments-table', className)}>
            <div className="payments-table__row payments-table__row_title">
                <div className="payments-table__row-content">
                    <div className="payments-table__col payments-table__col_check">
                        {/* {awaiting ? (
                            <Checkbox
                                active={awaitingData?.length === selectedTxn?.length}
                                onClick={handleSelectAll}
                            />
                        ) : (
                            <></>
                        )} */}
                    </div>
                    <div className="payments-table__col payments-table__col_type">Type</div>
                    <div className="payments-table__col payments-table__col_date">Date</div>
                    <div className="payments-table__col payments-table__col_amount">Amount ($)</div>
                    <div className="payments-table__col payments-table__col_currency">Currency</div>
                    <div className="payments-table__col payments-table__col_safe">Safe</div>
                    <div className="payments-table__col payments-table__col_request">
                        {!upcoming && !awaiting ? 'Executed By' : 'Initiated By'}
                    </div>
                    {upcoming && (
                        <div className="payments-table__col payments-table__col_approved">
                            {'Approved'}
                        </div>
                    )}
                    <div className="payments-table__col payments-table__col_status">
                        {awaiting ? 'Linked To' : 'Status'}
                    </div>
                </div>
            </div>
            <TransitionGroup className="payments-table__items" component="ul">
                <>
                    {awaiting &&
                        awaitingDataFiltered.map((item, index) => (
                            <CSSTransition key={index} timeout={500} classNames="table-item">
                                <PaymentsTableItem
                                    id={index}
                                    data={item}
                                    upcoming={upcoming}
                                    awaitingData={item}
                                    awaiting={awaiting}
                                    setTemp={setTemp}
                                    temp={temp}
                                    payIds={payIds}
                                    check={selectedTxn?.some(
                                        (txn) => txn.payout_id === item.payout_id
                                    )}
                                    setCheck={() => handleSingleSelect(item)}
                                    checkDisabled={
                                        !!selectedTxn?.length &&
                                        selectedTxn[0].provider.address !== item.provider.address
                                    }
                                />
                            </CSSTransition>
                        ))}
                    {upcoming &&
                        queuedDataFiltered.map((item, index) => (
                            <CSSTransition key={index} timeout={500} classNames="table-item">
                                <PaymentsTableItem
                                    id={index}
                                    queuedData={item}
                                    upcoming={upcoming}
                                    setTemp={setTemp}
                                    temp={temp}
                                    payIds={payIds}
                                    queuedTxnDetails={queuedDataFiltered}
                                />
                            </CSSTransition>
                        ))}
                    {!awaiting &&
                        !upcoming &&
                        historyDataFiltered.map((item, index) => (
                            <CSSTransition key={index} timeout={500} classNames="table-item">
                                <PaymentsTableItem
                                    id={index}
                                    historyData={item}
                                    upcoming={upcoming}
                                    setTemp={setTemp}
                                    temp={temp}
                                    payIds={payIds}
                                />
                            </CSSTransition>
                        ))}
                </>
            </TransitionGroup>
        </div>
    );
};

export default PaymentsTable;
