import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetBlogQuery } from 'store/services/Dashboard/dashboard';
import { blogData } from 'store/services/Dashboard/model';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import BlogsAdd from 'components/@popups/BlogsAdd/BlogsAdd';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { BlogsPopup } from './components';
import { BlogsItem, BlogsSkeleton } from './components';
import './blogs.scss';

export const Blogs: React.FC = (props = {}) => {
    const blogsPopup = usePopup();
    const blogsAdd = usePopup();
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [getBlogs] = useLazyGetBlogQuery();
    const [data, setData] = useState<blogData[]>([]);
    const [loading, setLoading] = useState(false);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const fetchData = () => {
        setLoading(true);
        getBlogs(daoid!, true)
            .unwrap()
            .then((res) => {
                setData(res?.data || []);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        (!!daoid || !!activeDAO) && fetchData();
    }, [daoid, activeDAO]);

    return (
        <Block {...props} className="blogs" data-analytics-parent="blogs_websites_widget">
            <Block.Header className="blogs__header">
                <Block.Title>Websites / Blogs</Block.Title>
                <Block.Link onClick={blogsPopup.open} data-analytics-click="blogs_widget_expand" />
            </Block.Header>
            {data.length > 0 && (
                <Block.Scrollable>
                    <div className="blogs__wrapper">
                        <Skeleton
                            className="blogs__list"
                            component="ul"
                            loading={loading}
                            skeleton={<BlogsSkeleton />}
                        >
                            {data
                                ?.slice(0, 3)
                                .map((item) => <BlogsItem key={item.id} item={item} />)}
                        </Skeleton>
                    </div>
                </Block.Scrollable>
            )}
            {/* {data.length > 0 && access && (
                <button className={styles.reviewsPreviewBtn} onClick={blogsAdd.open} data-analytics-click='add_website_blog'>
                    <span>Create a Blog</span>
                </button>
            )} */}
            {data.length === 0 && (
                <div className="blogs-empty">
                    <ul className="blogs-empty__list">
                        <li className="blogs-empty__item">
                            <div className="blogs-empty__data">
                                <img src="/img/blog.svg" alt="blogs" className="blogs-empty__img" />
                                {access ? (
                                    <>
                                        <p className="blogs-empty__text">
                                            Connect your Mirror or Medium!
                                        </p>
                                        <Button
                                            className="blogs-empty__linkBtn"
                                            color="orange-outlined"
                                            onClick={blogsAdd.open}
                                            data-analytics-click="add_link_button"
                                        >
                                            <span>Add a link</span>
                                        </Button>
                                    </>
                                ) : (
                                    <p className="blogs-empty__text">
                                        Ask your admin to connect Mirror or Medium!
                                    </p>
                                )}
                            </div>
                        </li>
                        {[1, 2].map((index) => (
                            <li className="blogs-empty__item" key={index}>
                                <div className="blogs-empty__content">
                                    <span className="blogs-empty__bigBlock" />
                                    <span className="blogs-empty__blockTitle" />
                                    <span className="blogs-empty__blockText" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <PopupBox active={blogsPopup.active} onClose={blogsPopup.close}>
                <BlogsPopup blogs={data} fetchData={fetchData} onClose1={blogsPopup.close} />
            </PopupBox>
            <PopupBox active={blogsAdd.active} onClose={blogsAdd.close}>
                <BlogsAdd
                    onClose={blogsPopup.close}
                    fetchData={fetchData}
                    onClose1={blogsAdd.close}
                />
            </PopupBox>
        </Block>
    );
};
