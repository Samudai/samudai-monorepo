import { ConnectionsItem } from 'components/@pages/connections';
import { Skeleton } from 'components/new-skeleton';
import Sprite from 'components/sprite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Head from 'ui/head';
import css from './connections.module.scss';
import { useFetchProfileDaos } from 'components/@pages/new-profile';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import { useParams } from 'react-router-dom';

const enum Status {
    MOST_ACTIVE = 'Most Active',
    MOST_VIEWED = 'Most Viewed',
    FEATURED = 'Featured',
}

const Connections = () => {
    const [searchValue, setSearchValue] = useState('');

    const { loading, memberRequests, mostActive, mostViewed } = useFetchProfileDaos();

    const [requests, setRequests] = useState<MemberResponse[]>([]);
    const { memberid } = useParams();

    const filteredRequests = useMemo(() => {
        if (searchValue === '') return requests;
        return requests.filter(
            (member) =>
                member.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                member.username?.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [searchValue, requests]);

    const getMemberStatus = useCallback(
        (memberId: string) => {
            if (mostActive === memberId) return Status.MOST_ACTIVE;
            if (mostViewed === memberId) return Status.MOST_VIEWED;
        },
        [mostActive, mostViewed]
    );

    useEffect(() => {
        setRequests(memberRequests);
    }, [memberRequests]);

    return (
        <div className={css.con}>
            <Head
                breadcrumbs={[
                    { name: 'Profile', href: `/${memberid}/profile` },
                    { name: 'Connections', href: `/${memberid}/connections` },
                    { name: 'Pending Requests' },
                ]}
                breadcrumbsComp={
                    <div className={css.controls}>
                        <button className={css.inviteBtn}>
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
                        <Head.Title title="Pending Requests" />

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
                        filteredRequests.map((item) => (
                            <li className={css.list_item} key={item.member_id}>
                                <ConnectionsItem
                                    data={item}
                                    setData={setRequests}
                                    status={getMemberStatus(item.member_id)}
                                    pending
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
