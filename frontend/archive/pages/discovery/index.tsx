import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiscoverDAOResponse, DiscoverMemberResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import {
    useLazyDiscoveryDaoQuery,
    useLazyDiscoveryMemberQuery,
    useLazyGetFavDaosQuery,
} from 'store/services/Discovery/Discovery';
import { useLazySearchDAOQuery, useLazySearchMemberQuery } from 'store/services/Search/Search';
import useDebounce from 'hooks/useDebounce';
import useInput from 'hooks/useInput';
import usePopup from 'hooks/usePopup';
import DiscoveryCard from 'components/@pages/discovery/elements/DiscoveryCard';
import DiscoveryFilter from 'components/@pages/discovery/elements/DiscoveryFilter';
import { getDefaultDiscoveryFilter, getSortList } from 'components/@pages/discovery/utils/filters';
import { DiscoveryFilterType, DiscoverySortType } from 'components/@pages/discovery/utils/types';
import Filter from 'components/@popups/components/elements/Filter';
import Loader from 'components/Loader/Loader';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import Head from 'ui/head';
import { toast } from 'utils/toast';
import { Roles } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import styles from './discovery.module.scss';

const getRole = (role?: string) => {
    switch ((role || '').toLowerCase()) {
        case Roles.ADMIN.toLowerCase():
            return Roles.ADMIN;
        case Roles.CONTRIBUTOR.toLowerCase():
            return Roles.CONTRIBUTOR;
        case Roles.CAPTAIN.toLowerCase():
            return Roles.CAPTAIN;
        default:
            return Roles.ADMIN;
    }
};

const tabs = [
    {
        name: 'DAO',
        value: Roles.ADMIN,
    },
    {
        name: 'Contributor',
        value: Roles.CONTRIBUTOR,
    },
    // {
    //   name: 'Captain',
    //   value: Roles.CAPTAIN,
    // },
];

const Discovery: React.FC = () => {
    const navigate = useNavigate();
    const { daoid, role: discoveryRole } = useParams<{ daoid: string; role?: string }>();
    const [daoData, setDaoData] = useState<any[]>([]);
    const [memberData, setMemberData] = useState<any[]>([]);
    const [favDaos, setFavDaos] = useState<any>({});
    const role = useMemo(() => getRole(discoveryRole), [discoveryRole]);
    // const [role, setRole] = useState<Roles>(getRole(discoveryRole));
    const [sort, setSort] = useState<DiscoverySortType>(getSortList(role === Roles.ADMIN)[0]);
    const [loading, setLoading] = useState<boolean>(false);
    const [rangeBounty, setRangeBounty] = useState({ min: 0, max: 0 });
    const [filter, setFilter] = useState<DiscoveryFilterType>(getDefaultDiscoveryFilter());
    const [search, setSearch, , clearSearch] = useInput('');
    const filterPopup = usePopup();

    const [searchDao] = useLazySearchDAOQuery();
    const [searchMember] = useLazySearchMemberQuery();
    const [getDiscoveryDao] = useLazyDiscoveryDaoQuery();
    const [getDiscoveryMember] = useLazyDiscoveryMemberQuery();
    const [getFavoriteDaos] = useLazyGetFavDaosQuery();

    const fun1 = async () => {
        if (search.length > 1 && search.length < 3) return;
        try {
            setLoading(true);
            const res = await getDiscoveryDao(!!search ? `query=${search}` : '').unwrap();
            const res3 = await getFavoriteDaos(getMemberId()).unwrap();
            setDaoData(res?.data || ([] as DiscoverDAOResponse[]));
            const daoToFavMap = res3?.data?.favourite_list?.reduce((acc: any, dao: any) => {
                acc[dao?.dao_id] = dao?.favourite_id;
                return acc;
            }, {});
            setFavDaos(daoToFavMap || {});
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast('Failure', 5000, 'Error in fetching discovery data', '');
        }
    };
    const fun2 = async () => {
        if (search.length > 1 && search.length < 3) return;
        try {
            setLoading(true);
            const res2 = await getDiscoveryMember(!!search ? `query=${search}` : '').unwrap();
            setMemberData(res2?.data || ([] as DiscoverMemberResponse[]));
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast('Failure', 5000, 'Error in fetching discovery data', '');
        }
    };
    const funDiscovery = useDebounce(fun1, 500);
    const funMember = useDebounce(fun2, 500);

    useEffect(() => {
        const param = (discoveryRole || '').toLowerCase();

        if (param !== 'dao' && param !== 'contributor') {
            navigate(`/${daoid}/discovery`);
        }
    }, [role]);

    useEffect(() => {
        role === Roles.ADMIN && funDiscovery(undefined);
    }, [daoid, search, role]);

    useEffect(() => {
        role !== Roles.ADMIN && funMember(undefined);
    }, [daoid, search, role]);

    // const items = useMemo(() => {
    //   const type = Roles.ADMIN ? 'projects_ongoing' : 'tasks_ongoing';
    //   return ((role === Roles.ADMIN ? daoData : memberData) || []).sort((a, b) => {
    //     return (+a[type] - +b[type]) * sort.sign;
    //   });
    // }, [filter, sort]);

    const handleClearFilter = () => {
        setFilter({ ...getDefaultDiscoveryFilter(), bounty: rangeBounty });
    };

    // useEffect(() => {
    //   let minBounty = items[0].bounty_earned;
    //   let maxBounty = items[0].bounty_earned;

    //   for (let { bounty_earned } of items) {
    //     if (bounty_earned < minBounty) {
    //       minBounty = bounty_earned;
    //     }
    //     if (bounty_earned > maxBounty) {
    //       maxBounty = bounty_earned;
    //     }
    //   }

    //   const bounty = {
    //     min: minBounty,
    //     max: maxBounty,
    //   };

    //   setFilter((prev) => ({ ...prev, bounty }));
    //   setRangeBounty(bounty);
    // }, []);

    useEffect(() => {
        /* 
      Clear all data
    */
        setFilter(getDefaultDiscoveryFilter());
        clearSearch();
    }, [role]);

    return (
        <div className={styles.root} data-analytics-page={`discovery_${discoveryRole}`}>
            <Head breadcrumbs={[{ name: 'Discovery' }, { name: role }]}>
                <div className={styles.root_head}>
                    <Head.Title
                        title={
                            role === Roles.ADMIN
                                ? 'Discover DAO'
                                : role === Roles.CAPTAIN
                                ? 'Discover Captains'
                                : 'Discover Contributors'
                        }
                    />
                    <Input
                        placeholder="Search..."
                        className={styles.search}
                        value={search}
                        onChange={setSearch}
                        icon={<Magnifier className={styles.searchIcon} />}
                    />
                </div>
            </Head>
            <div className={clsx('container', styles.container)}>
                <div className={styles.panel}>
                    <div className={styles.panelLeft}>
                        {/* <Button
              color="orange"
              className={styles.filterBtn}
              onClick={filterPopup.open}
            >
              <SettingsIcon />
              <span>Filter</span>
            </Button>
          </div>
          <div className={styles.panelRight}>
            <p className={styles.subtitle}>Sort by</p>
            <DiscoverySelect
              active={sort}
              items={getSortList(role === Roles.ADMIN).filter(
                (r) => r.name !== sort.name
              )}
              handleChange={(item: DiscoverySortType) => setSort(item)}
            /> */}
                    </div>
                </div>
                {/* {filter.skills.length > 0 && (
          <div className={styles.filter}>
            <ul className={styles.filterSkills}>
              {filter.skills.map((skill) => (
                <UserSkill
                  className={styles.filterSkillsItem}
                  skill={skill}
                  key={skill.id}
                />
              ))}
            </ul>
            <button className={styles.filterClearBtn} onClick={handleClearFilter}>
              <span>Clear All</span>
            </button>
          </div>
        )} */}
                {!loading ? (
                    <div className={styles.body}>
                        <ul className={styles.list}>
                            {(role === Roles.ADMIN ? daoData : memberData || []).map((item) => (
                                <DiscoveryCard
                                    type={role === Roles.ADMIN ? 'dao' : 'profile'}
                                    data={item}
                                    favDaoId={favDaos[item.dao_id]}
                                    key={role === Roles.ADMIN ? item?.dao_id : item?.member_id}
                                />
                            ))}
                        </ul>
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
            <Filter active={filterPopup.active} onClose={filterPopup.close}>
                <DiscoveryFilter
                    active={filterPopup.active}
                    role={role}
                    filter={filter}
                    setFilter={setFilter}
                    clearFilter={handleClearFilter}
                    onClose={filterPopup.close}
                    meta={{ rangeBounty }}
                />
            </Filter>
        </div>
    );
};

export default Discovery;
