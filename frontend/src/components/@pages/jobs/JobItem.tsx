import clsx from 'clsx';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import styles from './styles/JobItem.module.scss';
import { OpportunityOpenTo } from '@samudai_xyz/gateway-consumer-types/dist/types/jobs/enums';

type JobItemProps =
    | {
          placeholder: true;
      }
    | {
          placeholder?: false;
          title: string;
          department: string;
          minPeople: number;
          tags: string[];
          payoutAmount: number;
          payoutCurrency: string;
          saved: boolean;
          openTo: OpportunityOpenTo[];
          type?: 'card';
          onSave?: () => void;
          onDetail?: () => void;
      };

const TAGS_MAX = 2;

const JobItem: React.FC<JobItemProps> = (props) => {
    const handleClickItem = (ev: React.MouseEvent<HTMLLIElement>) => {
        const target = ev.target as HTMLLIElement;
        if (!target.closest('button')) {
            if (!props.placeholder && props.onDetail) {
                props.onDetail();
            }
        }
    };

    return props.placeholder ? (
        <li className={clsx(styles.root, styles.placeholder)}>
            <div data-col className={styles.colTitle} data-col-title="Jobs"></div>
            <div data-col className={styles.colDepartment} data-col-title="Department"></div>
            <div data-col className={styles.colPeople} data-col-title="Min of people"></div>
            <div data-col className={styles.colTags} data-col-title="Tags"></div>
            <div data-col className={styles.colPayout} data-col-title="Payout"></div>
            <div data-col className={styles.colOpen} data-col-title="Open to"></div>
            <div data-col className={styles.colСontrols} data-col-title=""></div>
        </li>
    ) : (
        <li
            className={clsx(styles.root, props.type === 'card' && styles.root_card)}
            onClick={handleClickItem}
        >
            <div data-col className={styles.colTitle}>
                <p className={styles.title}>{props.title}</p>
            </div>
            <div data-col className={styles.colDepartment}>
                <p className={styles.colPlaceholder}>Department</p>
                <p className={styles.text}>{props.department}</p>
            </div>
            <div data-col className={styles.colPeople}>
                <p className={styles.colPlaceholder}>Min of people</p>
                <p className={styles.text}>{props.minPeople}</p>
            </div>
            <div data-col className={styles.colTags}>
                {/* 
          Tags do not have icons. If, as planned, you need to display skills, 
          you need to specify the corresponding title in the figma.
        */}
                <ul className={styles.tags}>
                    {props.tags?.slice(0, TAGS_MAX).map((tag) => (
                        <li className={styles.tagsItem} key={tag}>
                            {tag}
                        </li>
                    ))}
                    {(props.tags || []).length > TAGS_MAX && (
                        <li className={styles.tagsMax}>+{(props.tags || []).length - TAGS_MAX}</li>
                    )}
                </ul>
            </div>
            <div data-col className={styles.colPayout}>
                <p className={styles.colPlaceholder}>Payout</p>
                <p className={styles.text}>{props.payoutAmount + '' + props.payoutCurrency}</p>
            </div>
            <div data-col className={styles.colOpen}>
                <p className={styles.colPlaceholder}>Open to</p>
                <p className={styles.text}>
                    {props?.openTo?.map((role) => <span key={role}>{role}</span>)}
                </p>
            </div>
            <div data-col className={styles.colСontrols}>
                <button
                    className={clsx(styles.saveBtn, props.saved && styles.saveBtnActive)}
                    onClick={props.onSave}
                >
                    <ArchiveIcon />
                </button>
            </div>
        </li>
    );
};

export default JobItem;
