import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArchiveIcon } from '../icons/archive-icon';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import { BreadcrumbsItem } from 'components/breadcrumbs';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import PlusIcon from 'ui/SVG/PlusIcon';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import Head from 'ui/head';
import css from './jobs-header.module.scss';
import { JobsFilterInputs } from '../types';
import { SetFieldsType } from 'hooks/use-object-state';
import Filter from 'components/@popups/components/elements/Filter';
import { JobsFilterModal } from '../jobs-filter-modal';
import usePopup from 'hooks/usePopup';
import { getMemberId } from 'utils/utils';
import { useLazyDiscoveryDaoQuery } from 'store/services/Discovery/Discovery';
import { useProgress } from 'hooks/use-progress';

interface JobsHeaderProps {
    currentLink: string | string[];
    title: string;
    jobType?: string;
    controls?: {
        filter?: boolean;
        archive?: boolean;
        addNew?: boolean;
        filterRow?: boolean;
    };
    filter?: JobsFilterInputs;
    setFilter?: SetFieldsType<JobsFilterInputs>;
    onCreator?: () => void;
    breadcrumbs: BreadcrumbsItem[];
}

export const JobsHeader: React.FC<JobsHeaderProps> = ({
    currentLink,
    title,
    jobType,
    filter,
    setFilter,
    onCreator,
    breadcrumbs,
    controls = {
        addNew: true,
        archive: true,
        filter: true,
        filterRow: true,
    },
}) => {
    const [daoList, setDaoList] = useState<string[]>([]);

    const location = useLocation();
    const links = Array.isArray(currentLink) ? currentLink : [currentLink];
    const daoAccessList = useTypedSelector(selectAccessList);

    const filterModal = usePopup();
    const [getDiscoveryDao] = useLazyDiscoveryDaoQuery();
    const { daoProgress, memberType, manageDaoAccess } = useProgress();

    const createAccess = useMemo(() => {
        const manageAccessList = Object.values(daoAccessList).filter(
            (access) => access?.includes(AccessEnums.AccessType.MANAGE_DAO)
        );
        return Boolean(manageAccessList.length);
    }, [daoAccessList]);

    const fetchDao = async () => {
        await getDiscoveryDao({
            memberId: getMemberId(),
            filter: '',
        })
            .unwrap()
            .then((res) => {
                setDaoList(res?.data?.daos.map((dao) => dao.name) || []);
            });
    };

    useEffect(() => {
        fetchDao();
    }, []);

    return (
        <Head breadcrumbs={[{ name: 'Jobs' }, ...breadcrumbs]}>
            <div className={css.header_row} data-analytics-parent="jobs_header">
                <Head.Title title={title} />
                <Input
                    value={filter?.search}
                    onChange={(e) => setFilter?.({ search: e.target.value })}
                    className={css.header_input}
                    icon={<Magnifier className={css.header_input_magnifier} />}
                    placeholder="Search Job"
                    data-analytics-click="job_search_bar"
                />
                {controls.filter && (
                    <Button
                        className={css.filter_btn}
                        color="transparent"
                        onClick={filterModal.open}
                        data-analytics-click="filter_button"
                    >
                        <SettingsIcon />
                        <span>Filter</span>
                    </Button>
                )}
                {controls.archive && (
                    <NavLink
                        className={css.archive_btn}
                        to={`${location.pathname}/archive`}
                        data-analytics-click="archive_button"
                    >
                        <ArchiveIcon />
                        <span>Archive</span>
                    </NavLink>
                )}
                {controls.addNew && createAccess && (
                    <>
                        <Button
                            className={css.add_btn}
                            onClick={onCreator}
                            color="orange"
                            data-analytics-click="add_new_job_button"
                        >
                            <PlusIcon />
                            <span>Add New</span>
                        </Button>
                    </>
                )}
            </div>
            {/* <div className={css.header_row}></div> */}
            {filter && (
                <Filter
                    active={filterModal.active}
                    onClose={filterModal.close}
                    children={
                        <JobsFilterModal
                            filter={filter}
                            daoList={daoList}
                            setFilter={setFilter!}
                            onClose={filterModal.close}
                        />
                    }
                />
            )}
        </Head>
    );
};
