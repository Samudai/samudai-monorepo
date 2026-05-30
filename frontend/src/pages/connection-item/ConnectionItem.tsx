import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MembersEnums } from '@samudai_xyz/gateway-consumer-types';
import { setMemberData } from 'store/features/common/slice';
import {
    useGetMemberByIdMutation,
    useLazyGetConnectionsByMemberIdQuery,
    useUpdateConnectionMutation,
} from 'store/services/userProfile/userProfile';
import { useTypedDispatch } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import BookIcon from 'ui/SVG/BookIcon';
import RoundedDollarIcon from 'ui/SVG/RoundedDollarIcon';
import UserInfo from 'ui/UserInfo/ConnectionUserInfo';
import UserSkill from 'ui/UserSkill/UserSkill';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles1 from 'styles/pages/connections.module.scss';
import styles from './connection-item.module.scss';

interface DiscoverySelectProps {
    data: any;
    handleChange?: (item: any) => void;
    connected?: boolean;
    fetchRequests?: (payload: void) => Promise<any>;
    fetchConnections?: (payload: void) => Promise<any>;
}

const ConnectionItem: React.FC<DiscoverySelectProps> = ({
    data,
    handleChange,
    connected,
    fetchRequests,
    fetchConnections,
}) => {
    const { memberid } = useParams();
    const navigate = useNavigate();
    const [updateConnection] = useUpdateConnectionMutation();
    const [fetchUserProfile, { data: memberData }] = useGetMemberByIdMutation({
        fixedCacheKey: memberid,
    });
    const [getConnections] = useLazyGetConnectionsByMemberIdQuery();
    const dispatch = useTypedDispatch();
    const memberId = getMemberId();
    const [loading, setLoading] = useState(false);

    const AfterFetch = (res: any) => {
        getConnections(memberId, true)
            .unwrap()
            .then((connData) => {
                dispatch(setMemberData({ member: res.data!.member, connections: connData.data! }));
            });
    };

    useEffect(() => {
        const fn = async () => {
            if (memberData) {
                AfterFetch(memberData);
            } else {
                fetchUserProfile({
                    member: { type: 'member_id', value: memberId },
                })
                    .unwrap()
                    .then((data) => {
                        AfterFetch(data);
                    });
            }
        };
        fn();
    }, [loading]);

    const handleRequest = async (status: boolean) => {
        console.log(data);
        setLoading(true);
        try {
            const res = await updateConnection({
                connection: {
                    id: data.id,
                    sender_id: data.member_id,
                    receiver_id: getMemberId(),
                    status: status
                        ? MembersEnums.InviteStatus.ACCEPTED
                        : MembersEnums.InviteStatus.DECLINED,
                },
            }).unwrap();
            setTimeout(async () => {
                fetchConnections?.();
                fetchRequests?.();
            }, 2000);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast('Failure', 5000, 'Something went wrong', '');
        }
    };
    const handleMessage = (e: any) => {
        e.stopPropagation();
        toast('Success', 5000, 'Messaging feature coming soon', '')();
    };
    return (
        <div
            className={styles.root}
            onClick={() => navigate(`/${data.member_id}/profile`)}
            style={{ cursor: 'pointer' }}
            data-class="card"
            data-role="item"
            data-analytics-page="connection_item_page"
        >
            <div className={styles.wrapper} data-analytics-parent="connection_item_parent">
                <div className={styles.body}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                        }}
                    >
                        <UserInfo
                            data={{
                                member_id: data?.member_id || '',
                                username: data?.username || '',
                                profile_picture: data?.profile_picture || '',
                                name: data?.name || '',
                            }}
                            removeRating
                            className={styles.user}
                        />
                        <div className={styles1.hideButton}>
                            {!connected && (
                                <>
                                    <Button
                                        color="green"
                                        className={styles1.controlsButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRequest(true);
                                        }}
                                        data-analytics-click="connection_accept_btn"
                                    >
                                        <span>Accept</span>
                                    </Button>
                                    <Button
                                        className={styles1.controlsButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRequest(false);
                                        }}
                                        data-analytics-click="connection_reject_btn"
                                    >
                                        <span>Reject</span>
                                    </Button>
                                </>
                            )}
                            {!!connected && (
                                <>
                                    <Button color="green" className={styles1.controlsButton}>
                                        <span>Profile</span>
                                    </Button>
                                    <Button
                                        className={styles1.controlsButton}
                                        onClick={handleMessage}
                                        data-analytics-click="message_connection_btn"
                                    >
                                        <span>Message</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <ul className={styles.info}>
                        {
                            <li className={styles.infoItem}>
                                <ul className={styles.infoSkills}>
                                    {data?.skills
                                        ?.slice(0, 2)
                                        .map((skill: any) => (
                                            <UserSkill
                                                className={styles.infoSkillsItem}
                                                skill={skill}
                                                key={skill}
                                                hideCross
                                            />
                                        ))}
                                </ul>
                            </li>
                        }
                        <li className={styles.infoItem}>
                            <p className={styles.infoTitle}>Ongoing Projects</p>
                            <div className={styles.infoRow}>
                                <BookIcon className={styles.infoIcon} data-clr-green />
                                <p className={styles.infoValue}>{data.projects}</p>
                            </div>
                        </li>
                        {
                            <li className={styles.infoItem}>
                                <p className={styles.infoTitle}>Bounty Earned</p>
                                <div className={styles.infoRow}>
                                    <RoundedDollarIcon
                                        className={styles.infoIcon}
                                        data-clr-orange
                                    />
                                    {/* <p className={styles.infoValue}>${(data?.bounty / 1000).toFixed(0)}K</p> */}
                                    <p className={styles.infoValue}>{'...'}</p>
                                </div>
                            </li>
                        }
                    </ul>
                    <div className={styles.controls}>
                        <Button
                            className={styles.controlsButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRequest(true);
                            }}
                            data-analytics-click="accept_bounty_hunter_btn"
                        >
                            <span>Accept</span>
                        </Button>
                        <Button
                            className={styles.controlsButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRequest(false);
                            }}
                            data-analytics-click="reject_bounty_hunter_btn"
                        >
                            <span>Reject</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionItem;
