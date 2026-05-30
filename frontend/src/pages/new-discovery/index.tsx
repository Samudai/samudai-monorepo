import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePopup from 'hooks/usePopup';
import {
    DiscoveryCard,
    DiscoveryFilterModal,
    DiscoveryLoadState,
    useDiscoveryFilter,
    useFetchDiscovery,
} from 'components/@pages/new-discovery';
import { DiscoverySort } from 'components/@pages/new-discovery/ui/discovery-sort';
import Filter from 'components/@popups/components/elements/Filter';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import Head from 'ui/head';
import css from './discovery.module.scss';
import Loader from 'components/Loader/Loader';

const enum Status {
    MOST_ACTIVE = 'Most Active',
    MOST_VIEWED = 'Most Viewed',
    FEATURED = 'Featured',
}

const Discovery: React.FC = () => {
    const { role: roleParam, daoid } = useParams<{ role: string; daoid: string }>();
    const role = useMemo(() => roleParam?.toLowerCase() || '', [roleParam]);
    const { filter, setFilter, defaultFilter } = useDiscoveryFilter();
    const { daoData, memberData, loading, discoveryTags, page, setPage, setLoading } =
        useFetchDiscovery(filter);

    const navigate = useNavigate();
    const filterModal = usePopup();

    const getDaoStatus = useCallback(
        (daoId: string) => {
            if (discoveryTags.mostActiveDao?.dao_id === daoId) return Status.MOST_ACTIVE;
            if (discoveryTags.mostViewedDao?.dao_id === daoId) return Status.MOST_VIEWED;
        },
        [discoveryTags]
    );

    const getContributorStatus = useCallback(
        (memberId: string) => {
            if (discoveryTags.mostActiveMember?.member_id === memberId) return Status.MOST_ACTIVE;
            if (discoveryTags.mostViewedMember?.member_id === memberId) return Status.MOST_VIEWED;
        },
        [discoveryTags]
    );

    useEffect(() => {
        if (role !== 'dao' && role !== 'contributor') {
            return navigate(`/${daoid}/discovery/dao`);
        }
    }, [role, daoid]);

    useEffect(() => {
        setLoading(true);
        setFilter(defaultFilter);
        setPage((page) => ({ ...page, number: 1, noFetch: false, isLoading: false }));
    }, [role]);

    const handleScroll = () => {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
            if (!page.isLoading && !page.noFetch) {
                setPage((page) => ({ ...page, number: page.number + 1, isLoading: true }));
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [page]);

    if (loading) {
        return <DiscoveryLoadState role={role} />;
    }

    return (
        <div className={css.discovery} data-analytics-page={'discovery_' + role}>
            <Head
                breadcrumbs={[
                    { name: 'Discovery' },
                    { name: role === 'dao' ? 'DAO' : 'Contributor' },
                ]}
            >
                <div className={css.head_row} data-analytics-parent="discovery_header">
                    <Head.Title
                        className={css.head_title}
                        title={`Discovery ${role === 'dao' ? 'DAO' : 'Contributor'}`}
                    />

                    <div className={css.sort}>
                        <DiscoverySort
                            type={role}
                            value={filter.sort}
                            onChange={(sort) => setFilter({ sort: sort })}
                            onClear={() => setFilter({ sort: { name: '', value: '' } })}
                        />
                    </div>

                    <Input
                        placeholder={`Search ${role === 'dao' ? 'DAO' : 'Contributor'}`}
                        value={filter.search}
                        onChange={(ev) => setFilter({ search: ev.target.value })}
                        className={css.search}
                        icon={<Magnifier className={css.search_icon} />}
                        data-analytics-click="job_search_bar"
                    />

                    <Button
                        className={css.filter_btn}
                        onClick={filterModal.open}
                        color="orange"
                        data-analytics-click="filter_button"
                    >
                        <SettingsIcon />
                        <span>Filter</span>
                    </Button>
                </div>
            </Head>

            <div className={css.content}>
                <div className="container">
                    <ul className={css.list}>
                        {role === 'dao' &&
                            daoData?.map((item, id) => (
                                <li className={css.list_item} key={item.dao_id}>
                                    <DiscoveryCard
                                        type="dao"
                                        id={item.dao_id}
                                        name={item.name}
                                        href={`/discovery/dao/${item.dao_id}`}
                                        profilePicture={item.profile_picture}
                                        totalPictures={item.members_count}
                                        pictures={item.members_profile_pictures || []}
                                        tags={item.tags}
                                        open={item.open_to_collaboration}
                                        status={getDaoStatus(item.dao_id)}
                                        isMember={item.ismember}
                                        joinDaoLink={item.join_dao_link}
                                    />
                                </li>
                            ))}

                        {role === 'contributor' &&
                            memberData.map((item, id) => (
                                <li className={css.list_item} key={item.member_id}>
                                    <DiscoveryCard
                                        type="contributor"
                                        id={item.member_id}
                                        name={item.name || ''}
                                        href={`/${item.member_id}/profile`}
                                        profilePicture={item.profile_picture}
                                        pictures={item.dao_worked_profile_pictures || []}
                                        totalPictures={item.dao_worked_count}
                                        tags={item.skills}
                                        open={item.open_for_opportunity}
                                        status={getContributorStatus(item.member_id)}
                                        isMember={item.isconnection}
                                    />
                                </li>
                            ))}
                    </ul>
                    {!!page.isLoading && <Loader removeBg className={css.loader} />}
                </div>
            </div>

            <Filter
                active={filterModal.active}
                onClose={filterModal.close}
                children={
                    <DiscoveryFilterModal
                        type={role}
                        filter={filter}
                        setFilter={setFilter}
                        onClose={filterModal.close}
                    />
                }
            />
        </div>
    );
};

export default Discovery;
