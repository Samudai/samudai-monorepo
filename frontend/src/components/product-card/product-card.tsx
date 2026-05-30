import React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Button from 'ui/@buttons/Button/Button';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import JobsBoardIcon from 'ui/SVG/sidebar/JobsBoardIcon';
import SmsIcon from 'ui/SVG/sidebar/SmsIcon';
import { beautifySum } from 'utils/format';
import styles from './product-card.module.scss';

interface ProductCardProps {
    className?: string;
    title: string;
    logo: string;
    company: string;
    isSaved?: boolean;
    applyTo: string;
    matchLevel: string;
    type: string;
    experience: number;
    bounty: number;
    qualifications: string[];
    banner?: string;
    createdAt?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    applyTo,
    bounty,
    company,
    experience,
    isSaved,
    logo,
    matchLevel,
    qualifications,
    title,
    type,
    banner,
    className,
    createdAt,
}) => {
    return (
        <div className={clsx(styles.product, className)}>
            <div className={styles.product_banner}>
                {banner && <img src={banner} alt="banner" className="img-cover" />}
            </div>
            <div className={styles.product_content}>
                {/* Logo */}
                <div className={styles.product_logo}>
                    {logo && <img src={logo} alt="logo" className="img-cover" />}
                </div>
                {/* Created At */}
                <p className={styles.product_created}>{dayjs(createdAt).fromNow()}</p>
                {/* Head */}
                <div className={styles.product_head}>
                    <h3 className={styles.product_title}>{title}</h3>
                    <button className={styles.product_saveBtn}>
                        <ArchiveIcon className={isSaved && styles.product_saveBtn_saved} />
                    </button>
                </div>
                {/* Company */}
                <p className={styles.product_company}>{company}</p>
                {/* Skills */}
                <div />
                {/* Apply */}
                <div className={styles.product_apply}>
                    {/* Apply Block */}
                    <div className={styles.product_apply_block}>
                        <p className={styles.product_apply_left}>
                            <CalendarIcon /> <span>Apply by</span>
                        </p>
                        <p className={styles.product_apply_right}>
                            <span>{dayjs(applyTo).format('DD MMM, YYYY')}</span>
                        </p>
                    </div>
                    {/* Apply Match */}
                    <div className={styles.product_apply_match}>
                        <p className={styles.product_apply_level}>Match level</p>
                        <p className={styles.product_apply_label}>{matchLevel}</p>
                    </div>
                </div>
                {/* Info */}
                <ul className={styles.product_info}>
                    <li className={styles.product_info_item}>
                        <div className={styles.product_info_block}>
                            <h5 className={styles.product_info_title}>Job Type</h5>
                            <p className={styles.product_info_value}>{type}</p>
                        </div>
                    </li>
                    <li className={styles.product_info_item}>
                        <div className={styles.product_info_block}>
                            <h5 className={styles.product_info_title}>Experience</h5>
                            <p className={styles.product_info_value}>{experience / 12} Year(s)</p>
                        </div>
                    </li>
                    <li className={styles.product_info_item}>
                        <div className={styles.product_info_block}>
                            <h5 className={styles.product_info_title}>Bounty</h5>
                            <p className={styles.product_info_value}>
                                <span>$</span>
                                {beautifySum(bounty)}
                            </p>
                        </div>
                    </li>
                </ul>
                {/* Qualification */}
                <div className={styles.product_qual}>
                    <h4 className={styles.product_qual_title}>Qualification Required</h4>
                    <ul className={styles.product_qual_list}>
                        {qualifications.map((q) => (
                            <li className={styles.product_qual_item} key={q}>
                                {q}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Controls */}
                <footer className={styles.product_controls}>
                    <Button color="green" className={styles.product_applyBtn}>
                        <JobsBoardIcon />
                        <span>Apply</span>
                    </Button>
                    <Button color="black" className={styles.product_mainBtn}>
                        <SmsIcon />
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default ProductCard;
