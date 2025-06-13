import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiscussionResponse } from '@samudai_xyz/gateway-consumer-types';
import routes from 'root/router/routes';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazyGetDiscussionsQuery } from 'store/services/Discussion/discussion';
import useRequest from 'hooks/useRequest';
import { useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { DiscussionsItem, DiscussionsSkeleton } from './components';
import './discussions.scss';

export const Discussions: React.FC = () => {
    const activeDao = useTypedSelector(selectActiveDao);
    const [discussions] = useLazyGetDiscussionsQuery();
    const { daoid } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<DiscussionResponse[]>([]);
    const [fetchData, loading] = useRequest(async function () {
        try {
            const response = await discussions(daoid! + '?empty=true', true).unwrap();
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    });

    const handleLink = () => {
        navigate('/' + daoid + routes.dicussions);
    };

    useEffect(() => {
        fetchData();
    }, [daoid]);
    return (
        <Block className="dao-discussions" data-analytics-parent="forum_widget">
            <Block.Header>
                <Block.Title>Forum</Block.Title>
                <Block.Link onClick={handleLink} data-analytics-click="visit_forums_button" />
            </Block.Header>
            <Block.Scrollable className="dao-discussions__content">
                <Skeleton
                    className="dao-discussions__list"
                    component="ul"
                    loading={loading}
                    skeleton={<DiscussionsSkeleton />}
                >
                    {data.length > 0 &&
                        (data || [])?.map((item) => (
                            <DiscussionsItem {...item} key={item.discussion_id} />
                        ))}
                    {data.length === 0 && (
                        <div className="forum-empty">
                            {[1, 2, 3].map((index) => (
                                <div className="forum-empty__item" key={index}>
                                    <div className="forum-empty__head">
                                        <span className="forum-empty__circle" />
                                        <div className="forum-empty__content">
                                            <span className="forum-empty__title" />
                                            <span className="forum-empty__title" />
                                        </div>
                                    </div>

                                    <span className="forum-empty__block" />
                                </div>
                            ))}

                            <p className="forum-empty__text">
                                Visit the Forums to check what’s buzzing
                            </p>

                            <Button
                                className="forum-empty__visitBtn"
                                color="orange-outlined"
                                onClick={() => navigate(`/${daoid}/forum`)}
                                data-analytics-click="visit_forums_button"
                            >
                                <span>Visit Forums</span>
                            </Button>
                        </div>
                    )}
                </Skeleton>
            </Block.Scrollable>
        </Block>
    );
};
