import React, { useEffect, useState } from 'react';
import { NotificationsEnums, WebNotification } from '@samudai_xyz/gateway-consumer-types';
import { useLazyFetchNotificationsQuery } from 'store/services/Notifications/Notifications';
import { NfItem, NfTitle } from 'components/notifications/elements';
import { NfRequest } from 'components/notifications/items';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';

interface ReviewsProps {}

const Reviews: React.FC<ReviewsProps> = (props) => {
    const [getNotifications] = useLazyFetchNotificationsQuery();
    const [data, setData] = useState<WebNotification[]>([] as WebNotification[]);

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await getNotifications(getMemberId()).unwrap();

                setData([...(res?.data || [])]?.reverse() || ([] as WebNotification[]));
                console.log('payment:', res?.data);
            } catch (err) {
                toast('Failure', 5000, 'Unable to fetch reviews notifications', 'Please retry')();
            }
        };
        fun();
    }, []);

    return (
        <>
            {data?.map((item) => {
                switch (item.notificationContent.type) {
                    case NotificationsEnums.NotificationType.ACT_FAST:
                        return (
                            <NfItem type="actions">
                                <NfTitle>
                                    {item?.notificationContent.notificationBody}
                                    {/* <span className="--clr-green">Product Designer</span>" */}
                                </NfTitle>
                                <NfRequest type="connection" data={item} />
                            </NfItem>
                        );

                    case NotificationsEnums.NotificationType.HEADS_UP:
                        return (
                            <NfItem type="alert">
                                <NfTitle>
                                    {item?.notificationContent.notificationBody}
                                    {/* <span className="--clr-green">Product Designer</span>" */}
                                </NfTitle>
                                <NfRequest type="connection" data={item} />
                            </NfItem>
                        );
                    case NotificationsEnums.NotificationType.KUDOS:
                        return (
                            <NfItem type="information">
                                <NfTitle>
                                    {item?.notificationContent.notificationBody}
                                    {/* <span className="--clr-green">Product Designer</span>" */}
                                </NfTitle>
                                <NfRequest type="connection" data={item} />
                            </NfItem>
                        );
                    case NotificationsEnums.NotificationType.TRACTION:
                        return (
                            <NfItem type="information">
                                <NfTitle>
                                    {item?.notificationContent.notificationBody}
                                    {/* <span className="--clr-green">Product Designer</span>" */}
                                </NfTitle>
                                <NfRequest type="connection" data={item} />
                            </NfItem>
                        );
                    default:
                        return null;
                }
            })}
        </>
        // <React.Fragment>
        //   <NfItem type="actions">
        //     <NfTitle>
        //       3 new Applicants for the vacancy "
        //       <span className="--clr-green">Product Designer</span>"
        //     </NfTitle>
        //     {Array.from({ length: 3 }).map((_, id) => (
        //       <NfApplicants key={id} />
        //     ))}
        //   </NfItem>

        //   <NfItem type="actions">
        //     <NfRequest type="connection" />
        //   </NfItem>

        //   <NfItem type="actions">
        //     <NfRequest type="cooperation" />
        //   </NfItem>

        //   <NfItem type="information">
        //     <NfTitle className="nf-img">
        //       <img src="/mockup/img/user-3.png" alt="user" />
        //       <p className="nf-title-text">Phyllis Hall updated task status </p>
        //     </NfTitle>
        //     <NfTask />
        //   </NfItem>

        //   <NfItem type="information">
        //     <NfViewProfile />
        //   </NfItem>

        //   <NfItem type="alert">
        // <NfTitle className={styles.viewed_profile}>
        //   Updated a widget Calendar info
        // </NfTitle>
        //     <NfWidgetUpdate />
        //   </NfItem>

        //   <NfItem type="alert">
        //     <NfTitle className="nf-img">
        //       <img src="/mockup/img/user-1.png" alt="user" />
        //       <p className="nf-title-text">Alena Williams add new Upcoming event</p>
        //     </NfTitle>
        //     <NfEvent />
        //   </NfItem>

        //   <NfItem type="alert">
        //     <NfTitle>Proposal posted</NfTitle>
        //     <NfProposal />
        //   </NfItem>

        //   <NfItem type="information">
        //     <NfTitle className="nf-img">
        //       <img src="/mockup/img/user-3.png" alt="user" />
        //       <p className="nf-title-text">
        //         Phyllis Hall invited you to the project,accept the invite{' '}
        //       </p>
        //     </NfTitle>
        //     <NfProject />
        //   </NfItem>

        //   <NfItem type="information">
        //     <NfTitle className="nf-img">
        //       <img src="/mockup/img/clan-logo-1.png" alt="user" />
        //       <p className="nf-title-text">
        //         For your job application <span className="--clr-orange">xyz DAO</span> wants
        //         to speak with you
        //       </p>
        //     </NfTitle>
        //     <NfJob />
        //   </NfItem>
        // </React.Fragment>
    );
};

export default Reviews;
