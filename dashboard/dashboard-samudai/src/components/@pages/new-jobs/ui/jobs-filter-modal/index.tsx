import React from 'react';
import { JobsFilterInputs } from '../types';
import { SetFieldsType } from 'hooks/use-object-state';
import css from './jobs-filter-modal.module.scss';
import { useJobsFilter } from '../../libs/hooks/use-jobs-filter';
import { JobsFilterItem } from '../jobs-filter-item';
import { useGetSkillListForJobQuery } from 'store/services/jobs/totalJobs';

interface JobsFilterModalProps {
    filter: JobsFilterInputs;
    daoList: string[];
    onClose: () => void;
    setFilter: SetFieldsType<JobsFilterInputs>;
}

export const JobsFilterModal: React.FC<JobsFilterModalProps> = ({
    filter,
    daoList,
    setFilter,
    onClose,
}) => {
    const { data: jobsSkillList } = useGetSkillListForJobQuery();
    const { defaultFilter } = useJobsFilter();

    const onClear = () => {
        setFilter(defaultFilter);
    };

    return (
        <div className={css.filter} data-analytics-parent="discovery_filter_modal_sidebar">
            <div className={css.head}>
                <h4 className={css.head_title}>Filter</h4>
                <button
                    className={css.head_clearBtn}
                    onClick={onClear}
                    data-analytics-click="clear_all_button"
                >
                    Clear all
                </button>
            </div>

            <JobsFilterItem
                title="DAO Names"
                items={daoList || []}
                isSearch
                placeholder="Search DAOs"
                maxShowItems={5}
                selectedItems={filter.dao_names}
                renderItem={(item) => <>{item}</>}
                onChange={(dao_names) => setFilter({ dao_names })}
            />

            <JobsFilterItem
                title="Skills"
                items={jobsSkillList?.data?.skills || []}
                maxShowItems={7}
                selectedItems={filter.tags}
                renderItem={(item) => <>{item}</>}
                onChange={(tags) => setFilter({ tags })}
            />
        </div>
    );
};
