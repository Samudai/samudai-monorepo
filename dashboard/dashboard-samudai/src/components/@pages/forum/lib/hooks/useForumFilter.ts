import { useCallback } from 'react';
import { DiscussionEnums, DiscussionResponse } from '@samudai_xyz/gateway-consumer-types';
import { useObjectState } from 'hooks/use-object-state';

export interface FilterValues {
    categories: string[];
    tags: string[];
}

const categories = Object.values(DiscussionEnums.DiscussionCategory) as string[];

export const useFilter = (discussionTags: string[]) => {
    const [filter, setFilter] = useObjectState<FilterValues>({
        categories,
        tags: ['All', ...discussionTags],
    });

    const toggleCategory = (name: string) => {
        const categories = filter.categories;

        if (categories.findIndex((c) => c === name) !== -1) {
            setFilter({
                categories: categories.filter((c) => c !== name),
            });
        } else {
            setFilter({ categories: [...categories, name] });
        }
    };

    const toggleTags = (name: string) => {
        const tags = filter.tags;

        const inList = tags.findIndex((t) => t === name) !== -1;

        if (name === 'All') {
            setFilter({ tags: inList ? [] : ['All', ...discussionTags] });
            return;
        }

        if (inList) {
            setFilter({ tags: [...tags.filter((t) => t !== 'All' && t !== name)] });
        } else {
            const isAll = tags.length + 1 === discussionTags.length;
            const newTags = [...tags, name];
            setFilter({ tags: isAll ? ['All', ...newTags] : newTags });
        }
    };

    const filterDiscussions = useCallback(
        (discussions: DiscussionResponse[]) => {
            const { tags, categories } = filter;
            const discussionList: DiscussionResponse[] = [];

            for (const discussion of discussions) {
                if (
                    [...categories, 'transaction'].findIndex((c) =>
                        discussion.category.toLowerCase().includes(c.toLowerCase())
                    ) === -1
                ) {
                    continue;
                }
                if (tags.includes('All')) {
                    discussionList.push(discussion);
                } else {
                    if (
                        tags.findIndex((c) => discussion.tags && discussion.tags.includes(c)) === -1
                    ) {
                        continue;
                    }
                    discussionList.push(discussion);
                }
            }

            return discussionList;
        },
        [filter]
    );

    const updateFilter = (filter: FilterValues) => {
        setFilter({ ...filter, tags: ['All', ...filter.tags] });
    };

    const updateTags = (tags: string[]) => {
        setFilter({ ...filter, tags: ['All', ...tags] });
    };

    return {
        toggleCategory,
        toggleTags,
        filterDiscussions,
        filter,
        updateFilter,
        updateTags,
    };
};
