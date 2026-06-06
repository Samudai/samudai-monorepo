import { useParams } from 'react-router-dom';
import { BlogsPopupItem } from '../blogs-popup-item';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectAccessList } from 'store/features/common/slice';
import { blogData } from 'store/services/Dashboard/model';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import BlogsAdd from 'components/@popups/BlogsAdd/BlogsAdd';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import css from './blogs-popup.module.scss';

interface BlogsPopupProps {
    blogs: blogData[];
    fetchData: () => void;
    onClose1: () => void;
}

export const BlogsPopup: React.FC<BlogsPopupProps> = ({ blogs, fetchData, onClose1 }) => {
    const blogsAdd = usePopup();
    const { daoid } = useParams();
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    return (
        <Popup
            className={css.root}
            onClose={onClose1}
            data-analytics-parent="blogs_widget_modal"
            dataParentId="blogs_widget_modal"
        >
            <div className={css.head}>
                <h2 className={css.headTitle}>Latest Blogs</h2>
                {access && (
                    <Button
                        color="orange"
                        onClick={blogsAdd.open}
                        data-analytics-click="add_website_blog_expanded_button"
                    >
                        <PlusIcon />
                        <span>Add Post</span>
                    </Button>
                )}
            </div>
            <ul
                className={clsx(
                    css.blogs,
                    blogs.length === 0 && css.blogsEmpty,
                    'orange-scrollbar'
                )}
            >
                {blogs.length === 0 && (
                    <div className={css.empty}>
                        <div className={css.empty_content}>
                            <img className={css.empty_img} src="/img/blog.svg" alt="blog" />

                            <p className={css.empty_text}>Connect your Mirror or Medium!</p>

                            <Button
                                className={css.empty_linkBtn}
                                color="orange-outlined"
                                onClick={blogsAdd.open}
                                data-analytics-click="add_link_button"
                            >
                                <span>Add a link</span>
                            </Button>
                        </div>

                        {/* <div className={css.empty_skeleton}>
                            <Skeleton 
                                styles={{
                                    borderRadius: 15,
                                    height: 116,
                                }}
                            />

                            <Skeleton 
                                styles={{
                                    marginTop: 16,
                                    borderRadius: 15,
                                    height: 39,
                                }}
                            />

                            <Skeleton 
                                styles={{
                                    marginTop: 16,  
                                    borderRadius: 15,
                                    height: 39,
                                    maxWidth: 156,
                                }}
                            />
                        </div> */}
                    </div>
                )}
                {blogs.length > 0 &&
                    blogs.map((blog) => (
                        <BlogsPopupItem
                            blog={blog}
                            key={blog.id}
                            access={access}
                            fetchData={fetchData}
                        />
                    ))}
            </ul>
            <PopupBox active={blogsAdd.active} onClose={blogsAdd.close}>
                <BlogsAdd onClose={onClose1} fetchData={fetchData} onClose1={blogsAdd.close} />
            </PopupBox>
        </Popup>
    );
};
