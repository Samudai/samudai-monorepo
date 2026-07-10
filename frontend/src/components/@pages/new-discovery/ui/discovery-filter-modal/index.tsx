import React from 'react';
import { useDiscoveryFilter } from '../../lib/hooks';
import { DiscoveryFilterInputs } from '../../types';
import { DiscoveryFilterItem } from '../discovery-filter-item';
import {
    useGetContributorDomainTagsQuery,
    useGetContributorSkillsQuery,
    useGetDaoTagsQuery,
} from 'store/services/Discovery/Discovery';
import { SetFieldsType } from 'hooks/use-object-state';
import Switch from 'ui/Switch/Switch';
import css from './discovery-filter-modal.module.scss';

interface DiscoveryFilterModalProps {
    type: string;
    filter: DiscoveryFilterInputs;
    onClose: () => void;
    setFilter: SetFieldsType<DiscoveryFilterInputs>;
}

export const DiscoveryFilterModal: React.FC<DiscoveryFilterModalProps> = ({
    type,
    filter,
    setFilter,
    onClose,
}) => {
    const { data: daoTagList } = useGetDaoTagsQuery();
    const { data: contributorTagList } = useGetContributorDomainTagsQuery();
    const { data: contributorSkillList } = useGetContributorSkillsQuery();
    const { defaultFilter } = useDiscoveryFilter();

    const onClear = () => {
        setFilter(defaultFilter);
    };

    const onCollaborate = () => {
        setFilter({
            open_to_collaborate: !filter.open_to_collaborate,
        });
    };

    const onOpportunity = () => {
        setFilter({
            open_for_opportunity: !filter.open_for_opportunity,
        });
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

            {type === 'dao' && (
                <div
                    className={css.collaborate}
                    onClick={onCollaborate}
                    data-analytics-click="dao_collaborate_switch"
                >
                    <p className={css.collaborate_text}>
                        <span>Open to</span> <span>Collaborate</span>
                    </p>

                    <Switch className={css.collaborate_radio} active={filter.open_to_collaborate} />
                </div>
            )}

            {type === 'contributor' && (
                <div
                    className={css.collaborate}
                    onClick={onOpportunity}
                    data-analytics-click="contributor_interested_switch"
                >
                    <p className={css.collaborate_text}>
                        <span>Open for</span> <span>Opportunity</span>
                    </p>

                    <Switch
                        className={css.collaborate_radio}
                        active={filter.open_for_opportunity}
                    />
                </div>
            )}

            <DiscoveryFilterItem
                title="Domain Tags"
                items={
                    (type === 'dao'
                        ? daoTagList?.data?.tags
                        : contributorTagList?.data?.domainTags) || []
                }
                maxShowItems={7}
                selectedItems={filter.tags}
                renderItem={(item) => <>{item}</>}
                onChange={(tags) => setFilter({ tags })}
            />

            {type === 'contributor' && (
                <DiscoveryFilterItem
                    title="Skills"
                    items={contributorSkillList?.data?.skills || []}
                    maxShowItems={7}
                    selectedItems={filter.skills}
                    renderItem={(item) => <>{item}</>}
                    onChange={(skills) => setFilter({ skills })}
                />
            )}
        </div>
    );
};
