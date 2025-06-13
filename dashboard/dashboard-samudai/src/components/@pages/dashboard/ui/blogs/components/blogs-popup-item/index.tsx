import { useDeleteBlogMutation } from 'store/services/Dashboard/dashboard';
import { blogData } from 'store/services/Dashboard/model';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { cutText } from 'utils/format';
import { openUrl } from 'utils/linkOpen';
import { toast } from 'utils/toast';
import styles from './blogs-popup-item.module.scss';

interface BlogsPopupItemProps {
    blog: blogData;
    access: boolean;
    fetchData: () => void;
}

export const BlogsPopupItem: React.FC<BlogsPopupItemProps> = ({
    blog: item,
    access,
    fetchData,
}) => {
    const [deleteBlog] = useDeleteBlogMutation();
    const handleDelete = async () => {
        try {
            await deleteBlog(item.id).unwrap();
            toast('Success', 5000, ' Blog deleted', '')();
            setTimeout(() => {
                fetchData();
            }, 1000);
        } catch (e) {
            toast('Failure', 5000, ' Blog not deleted', '')();
        }
    };
    return (
        <div className={styles.root}>
            <li className={styles.blogItem} key={item.id}>
                <div className={styles.blogWrapper}>
                    <div
                        className={styles.blogImage}
                        data-analytics-click={`blogs_item_click_${item.id}`}
                    >
                        <div className="blogs-item__img">
                            <img
                                src={item?.metadata?.ogImage?.url || ''}
                                alt="img"
                                className="img-cover"
                                onClick={() => {
                                    window.open(openUrl(item.link), '_blank');
                                }}
                            />
                        </div>
                        <h3 className="blogs-item__title">{cutText(item.metadata.ogTitle, 30)}</h3>
                        <p className="blogs-item__text">
                            {cutText(item.metadata.ogDescription, 52)}
                        </p>
                        {access && (
                            <SettingsDropdown className={styles.settings}>
                                <SettingsDropdown.Item
                                    onClick={handleDelete}
                                    data-analytics-click={`delete_blogs_item_${item.id}`}
                                >
                                    Delete
                                </SettingsDropdown.Item>
                                {/* <SettingsDropdown.Item>Item 2</SettingsDropdown.Item>
          <SettingsDropdown.Item>Item 3</SettingsDropdown.Item> */}
                            </SettingsDropdown>
                        )}
                    </div>
                </div>
            </li>
        </div>
    );
};
