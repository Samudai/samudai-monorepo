import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { tweet } from 'store/services/Dashboard/model';
import CommentsIcon from 'ui/SVG/CommentsIcon';
import HeartIcon from 'ui/SVG/HeartIcon';
import SharedIcon from 'ui/SVG/SharedIcon';
import VerifyIcon from 'ui/SVG/VerifyIcon';
import Twitter from 'ui/SVG/socials/Twitter';
import { openUrl } from 'utils/linkOpen';
import styles from './twitter-item.module.scss';

export const TwitterItem: React.FC<tweet> = ({
    id,
    name,
    img,
    text,
    links,
    date,
    verified,
    comments,
    shared,
    likes,
}) => {
    return (
        <li className={styles.item} key={id}>
            <div className={styles.itemWrapper}>
                <header className={styles.itemHeader}>
                    <div className={styles.itemImg}>
                        <img className="img-cover" src={img} alt="user" />
                    </div>
                    <div className={styles.itemUser}>
                        <h4 className={styles.itemName}>
                            <span style={{ color: 'white' }}>{name}</span>
                            {verified && <VerifyIcon />}
                        </h4>
                        <span className={styles.itemId}>@{id}</span>
                    </div>
                    <div
                        className={styles.itemSocials}
                        onClick={() => {
                            window.open(`https://twitter.com/${id}`, '_blank');
                        }}
                    >
                        <button className={styles.itemSocialsBtn}>
                            <Twitter />
                        </button>
                    </div>
                </header>
                <div className={styles.itemContent}>
                    <p className={styles.itemText}>{text}</p>
                    {(links || []).map((link, i) => (
                        <a className={styles.itemLink} href={openUrl(link)} key={link}>
                            {link}
                        </a>
                    ))}
                    {/* {(hashTags as any[]).map((tag) => (
            <span className="block-twitter-item__tag" key={tag}>
              {' '}
              {tag}
            </span>
          ))} */}
                </div>
                {/* <p className={styles.itemDate}>{!!date && date.slice(0, 10)}</p> */}
                <div className={styles.itemInfo}>
                    <NavLink
                        to="#"
                        className={clsx(styles.itemInfoItem, styles.comments)}
                        data-role="comments"
                        style={{ cursor: 'default' }}
                    >
                        <CommentsIcon />
                        {comments}
                    </NavLink>
                    <NavLink
                        to="#"
                        className={clsx(styles.itemInfoItem, styles.shared)}
                        data-role="shared"
                        style={{ cursor: 'default' }}
                    >
                        <SharedIcon />
                        {shared}
                    </NavLink>
                    <NavLink
                        to="#"
                        className={clsx(styles.itemInfoItem, styles.heart)}
                        data-role="likes"
                        style={{ cursor: 'default' }}
                    >
                        <HeartIcon />
                        {likes}
                    </NavLink>
                </div>
                {/* <div className={styles.line}></div> */}
            </div>
        </li>
    );
};
