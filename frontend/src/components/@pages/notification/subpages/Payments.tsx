import React, { useEffect, useState } from 'react';
import { NotificationsEnums, WebNotification } from '@samudai_xyz/gateway-consumer-types';
import { useLazyFetchNotificationsQuery } from 'store/services/Notifications/Notifications';
import { NfItem, NfTitle } from 'components/notifications/elements';
import { NfBounty, NfPayment } from 'components/notifications/items';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';

interface PaymentsProps {}

const Payments: React.FC<PaymentsProps> = (props) => {
    const [getNotifications] = useLazyFetchNotificationsQuery();
    const [data, setData] = useState<WebNotification[]>([] as WebNotification[]);
    useEffect(() => {
        const fun = async () => {
            try {
                const res = await getNotifications(getMemberId()).unwrap();
                setData([...(res?.data || [])]?.reverse() || ([] as WebNotification[]));
                console.log('payment:', res?.data);
            } catch (err) {
                toast('Failure', 5000, 'Unable to fetch payments notifications', 'Please retry')();
            }
        };
        fun();
    }, []);

    return (
        <React.Fragment>
            {(data || []).length > 0 &&
                data?.map((item) => {
                    switch (item.notificationContent.type) {
                        case NotificationsEnums.NotificationType.ACT_FAST:
                            return (
                                <NfItem type="actions">
                                    <NfTitle>Payment Pending</NfTitle>
                                    <NfPayment
                                        controls
                                        data={item.notificationContent}
                                        time={item.timestamp}
                                    />
                                </NfItem>
                            );
                        case NotificationsEnums.NotificationType.HEADS_UP:
                            return (
                                <NfItem type="information">
                                    <NfTitle>{item?.notificationContent.notificationBody}</NfTitle>
                                    <NfBounty
                                        data={item.notificationContent}
                                        time={item.timestamp}
                                    />
                                </NfItem>
                            );
                        default:
                            return null;
                    }
                })}
            {/* <NfItem type="information">
        <NfTitle>Payment Pending</NfTitle>
        <NfPayment />
      </NfItem>
      <NfItem type="actions">
        <NfTitle>
          Pending Payment for <span className="--clr-green">@alenawilliams01</span>
        </NfTitle>
        <NfPayment controls />
      </NfItem>
      <NfItem type="information">
        <NfTitle>Paid a bounty</NfTitle>
        <NfBounty />
      </NfItem> */}
        </React.Fragment>
    );
};

export default Payments;
