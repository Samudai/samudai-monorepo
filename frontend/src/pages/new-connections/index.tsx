import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConnectionsItem } from 'components/@pages/connections';
import { useFetchProfileDaos } from 'components/@pages/new-profile';
import { Skeleton } from 'components/new-skeleton';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Head from 'ui/head';
import css from './connections.module.scss';

const enum Status {
    MOST_ACTIVE = 'Most Active',
    MOST_VIEWED = 'Most Viewed',
    FEATURED = 'Featured',
}

const Connections = () => {
    const [searchValue, setSearchValue] = useState('');

    const { loading, connections, memberRequests, mostActive, mostViewed } = useFetchProfileDaos();

    const { memberid } = useParams();
    const navigate = useNavigate();

    const filteredConnections = useMemo(() => {
        if (searchValue === '') return connections;
        return connections.filter(
            (member) =>
                member.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                member.username?.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [searchValue, connections]);

    const getMemberStatus = useCallback(
        (memberId: string) => {
            if (mostActive === memberId) return Status.MOST_ACTIVE;
            if (mostViewed === memberId) return Status.MOST_VIEWED;
        },
        [mostActive, mostViewed]
    );

    return (
        <div className={css.con} data-analytics-page="connections_page">
            <Head
                breadcrumbs={[
                    { name: 'Profile', href: `/${memberid}/profile` },
                    { name: 'Connections' },
                ]}
                data-analytics-parent="connection_parent_breadcrumb"
                breadcrumbsComp={
                    <div className={css.controls}>
                        <button
                            className={css.inviteBtn}
                            data-analytics-click="invite_connections_btn"
                        >
                            <Sprite url="/img/sprite.svg#profile-add" />
                            <span>Invite</span>
                        </button>

                        <Button className={css.customizeBtn} color="orange">
                            <Sprite url="/img/sprite.svg#settings" />
                            <span>Customize</span>
                        </Button>
                    </div>
                }
            />

            <div className="container">
                <div className={css.head}>
                    <div className={css.head_row}>
                        <Head.Title title="Connections" />

                        <button
                            className={css.head_pendingBtn}
                            onClick={() => navigate(`/${memberid}/connections/requests`)}
                        >
                            <span>Pending Requests ({memberRequests?.length})</span>
                        </button>

                        <Input
                            className={css.search}
                            value={searchValue}
                            onChange={(ev) => setSearchValue(ev.target.value)}
                            icon={
                                <Sprite
                                    className={css.search_icon}
                                    url="/img/sprite.svg#magnifier"
                                />
                            }
                            placeholder="Search Network"
                        />

                        {/* <Button className={css.filterBtn} color="orange">
                            <Sprite url="/img/sprite.svg#filter" />
                            <span>Filter</span>
                        </Button> */}
                    </div>
                    {/* <div className={css.head_row}></div> */}
                </div>

                <ul className={css.list}>
                    {!loading &&
                        filteredConnections.map((item) => (
                            <li className={css.list_item} key={item.member_id}>
                                <ConnectionsItem
                                    data={item}
                                    status={getMemberStatus(item.member_id)}
                                />
                            </li>
                        ))}

                    {loading &&
                        [1, 2, 3, 4, 5, 6].map((index) => (
                            <li className={css.list_item} key={index}>
                                <Skeleton
                                    styles={{
                                        height: 360,
                                    }}
                                />
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default Connections;
