import { blogData } from 'store/services/Dashboard/model';
import { cutText } from 'utils/format';
import { openUrl } from 'utils/linkOpen';
import './blogs-item.scss';

export const BlogsItem: React.FC<{ item: blogData }> = ({ item }) => {
    return (
        <li
            className="blogs-item"
            onClick={() => {
                window.open(openUrl(item.link), '_blank');
            }}
            data-analytics-click={`blog_item_click_${item.id}`}
        >
            <div className="blogs-item__img" style={{ marginTop: '10px' }}>
                <img src={item?.metadata?.ogImage?.url || ''} alt="img" className="img-cover" />
            </div>
            <h3 className="blogs-item__title">{cutText(item.metadata.ogTitle, 19)}</h3>
            <p className="blogs-item__text">{cutText(item.metadata.ogDescription, 52)}</p>
        </li>
    );
};
