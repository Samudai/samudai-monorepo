import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DiscussionResponse } from '@samudai_xyz/gateway-consumer-types/';
import { useLazyGetDaoByDaoIdQuery } from 'store/services/Dao/dao';
import {
    useLazyGetDiscussionsByMemberIdQuery,
    useLazyGetTagsQuery,
} from 'store/services/Discussion/discussion';
import { useTypedDispatch } from 'hooks/useStore';
import { getMemberId } from 'utils/utils';
import {
    updateBookmarkCount,
    updateBookmarkedDiscussions,
    updateDiscussions,
    updateTags,
} from 'store/features/discussion/slice';

export const useForum = () => {
    const [discussions] = useLazyGetDiscussionsByMemberIdQuery();
    const [tags] = useLazyGetTagsQuery();
    const [daoData] = useLazyGetDaoByDaoIdQuery();
    const { daoid } = useParams();
    const [items, setItems] = useState<DiscussionResponse[]>([]);
    const [items1, setItems1] = useState<DiscussionResponse[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [daoName, setDaoName] = useState('Dao');

    const dispatch = useTypedDispatch();

    const fetchDiscussions = async () => {
        try {
            const response = await discussions(`${getMemberId()}/${daoid!}`).unwrap();
            const discussion = response.data;
            setItems(discussion);
            setItems1(discussion);
            dispatch(updateDiscussions(discussion));
            let bookmarkCount = 0;
            const bookmarkedDiscussions: string[] = [];
            discussion.forEach((item) => {
                if (item.pinned) {
                    bookmarkCount += 1;
                    bookmarkedDiscussions.push(item.discussion_id);
                }
            });
            dispatch(updateBookmarkCount(bookmarkCount));
            dispatch(updateBookmarkedDiscussions(bookmarkedDiscussions));
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDao = async () => {
        try {
            const data = await daoData(daoid!).unwrap();
            setDaoName(data.data!.dao.name);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await tags(daoid!).unwrap();
            if (res.data) {
                dispatch(updateTags(res.data));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            setLoaded(true);
            await fetchDiscussions();
            await fetchDao();
            await fetchTags();
            setLoaded(false);
        })();
    }, [daoid]);

    return {
        loaded,
        items,
        items1,
        fetchDiscussions,
    };
};
