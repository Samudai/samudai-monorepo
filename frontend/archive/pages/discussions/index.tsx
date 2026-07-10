import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
    AccessEnums,
    DiscussionEnums,
    DiscussionResponse,
} from '@samudai_xyz/gateway-consumer-types/';
import clsx from 'clsx';
import { selectAccess, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetDaoByDaoIdQuery } from 'store/services/Dao/dao';
import { useLazyGetDiscussionsByMemberIdQuery } from 'store/services/Discussion/discussion';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import DiscussionsCreate from 'components/@popups/DiscussionsCreate/DiscussionsCreate';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import RouteHeader from 'ui/RouteHeader/RouteHeader';
import PlusIcon from 'ui/SVG/PlusIcon';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import ChartIcons from 'ui/SVG/chart';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/discussions.module.scss';

const Discussions: React.FC = () => {
    const [discussions] = useLazyGetDiscussionsByMemberIdQuery();
    const [daoData] = useLazyGetDaoByDaoIdQuery();
    const activeDao = useTypedSelector(selectActiveDao);
    const { daoid } = useParams();
    const [items, setItems] = useState<DiscussionResponse[]>([]);
    const [items1, setItems1] = useState<DiscussionResponse[]>([]);
    const [filter, setFilter] = useState<string[]>(
        Object.values(DiscussionEnums.DiscussionCategory).map((val) => val.toLowerCase())
    );
    const [change, setChange] = useState(false);
    const createPopup = usePopup();
    const [isActiveDropdown, setActiveDropdown] = useState(false);

    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => updateState({}), []);
    const access = useTypedSelector(selectAccess) === AccessEnums.AccessType.MANAGE_DAO;
    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [daoName, setDaoName] = useState('Dao');

    const navigate = useNavigate();

    const toggleFilter = (type: DiscussionEnums.DiscussionCategory) => {
        if (filter.includes(type)) {
            setFilter(filter.filter((t) => t !== type));
        } else {
            setFilter([...filter, type]);
        }
        setChange(!change);
    };

    useEffect(() => {
        // if (!isActiveDropdown) {

        const filteredItems = items1.filter((item) => {
            const val = item.category.toLowerCase();
            return filter.includes(val);
        });
        setItems(filteredItems);
        // if (filter.length === 0 || filteredItems.length === 0) {
        //   const path = window.location.pathname;
        //   const pathArray = path.split('/');
        //   if (checkIfValidUUID(pathArray[pathArray.length - 1])) {
        //     navigate(pathArray.slice(0, pathArray.length - 1).join('/'));
        //   }
        // }
        // }
    }, [isActiveDropdown, filter.length, filter, change, items1]);

    const fetchDiscussions = async () => {
        try {
            const response = await discussions(`${getMemberId()}?daoId=${daoid!}`).unwrap();
            setLoaded(true);
            setItems(response?.data);
            setItems1(response?.data);
            console.log('discussion::', response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDiscussions();
    }, [daoid]);

    useEffect(() => {
        const fn = async () => {
            try {
                const data = await daoData(daoid!).unwrap();
                console.log(data);
                setDaoName(data.data!.dao.name);
                setLoaded2(true);
            } catch (e) {
                console.error(e);
            }
        };
        fn();
    }, [daoid]);
    //capitalise first letter js
    const capitaliseFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className={styles.root}>
            {loaded && loaded2 ? (
                <>
                    <div className={clsx('container', styles.container)}>
                        <RouteHeader className={styles.head}>
                            <div className={styles.head_left}>
                                <h1 className={styles.head_title}>Forum</h1>
                                <div className={styles.headPosts}>
                                    <ChartIcons.Increase />
                                    <span>{items?.length} Posts</span>
                                </div>
                            </div>
                            <div className={styles.head_right}>
                                <SettingsDropdown
                                    className={styles.filter}
                                    onToggle={setActiveDropdown}
                                    button={
                                        <div className={styles.filterBtn}>
                                            <SettingsIcon />
                                            <span>Filter</span>
                                        </div>
                                    }
                                >
                                    {Object.values(DiscussionEnums.DiscussionCategory).map(
                                        (type) => {
                                            const active = filter.includes(type);
                                            return (
                                                <SettingsDropdown.Item
                                                    className={clsx(
                                                        styles.filterItem,
                                                        active && styles.filterItemActive
                                                    )}
                                                    onClick={toggleFilter.bind(null, type)}
                                                    key={type}
                                                >
                                                    <Checkbox
                                                        active={active}
                                                        className={styles.filterCheckbox}
                                                    />
                                                    <p className={styles.filterName}>
                                                        {capitaliseFirstLetter(type)}
                                                    </p>
                                                </SettingsDropdown.Item>
                                            );
                                        }
                                    )}
                                </SettingsDropdown>
                                {access && (
                                    <Button className={styles.headBtn} onClick={createPopup.open}>
                                        <PlusIcon />
                                        <span>Create New</span>
                                    </Button>
                                )}
                            </div>
                        </RouteHeader>
                        <div className={styles.content}>
                            <Outlet context={items} />
                        </div>
                    </div>
                    <PopupBox active={createPopup.active} onClose={createPopup.close}>
                        <DiscussionsCreate
                            onClose={createPopup.close}
                            fetchDiscussions={fetchDiscussions}
                        />
                    </PopupBox>
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default Discussions;
