import clsx from 'clsx';
import dayjs from 'dayjs';
import Popup from 'components/@popups/components/Popup/Popup';
import Button from 'ui/@buttons/Button/Button';
import { File } from 'ui/Attachment';
import Members from 'ui/Members/Members';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import BookIcon from 'ui/SVG/BookIcon';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import LinkIcon from 'ui/SVG/LinkIcon';
import MarkIcon from 'ui/SVG/MarkIcon';
import JobsBoardIcon from 'ui/SVG/sidebar/JobsBoardIcon';
import SmsIcon from 'ui/SVG/sidebar/SmsIcon';
import SkillList from 'ui/SkillList/SkillList';
import { JobType, OpportunityResponse } from 'utils/types/Jobs';
import styles from '../styles/JobInfo.module.scss';

interface JobInfoProps {
    type: JobType;
    data: OpportunityResponse;
    onApply: (job: OpportunityResponse) => void;
}

const JobInfo: React.FC<JobInfoProps> = ({ data, type, onApply }) => {
    return (
        <Popup className={styles.root}>
            {/* Head */}
            <header className={styles.head}>
                <div className={styles.headUp}>
                    <div className={styles.headCompany}>
                        <div className={styles.headCompanyIcon}>
                            <img
                                src="/img/companies/crust.svg"
                                alt="company"
                                className="img-cover"
                            />
                        </div>
                        <p className={styles.headCompanyName}>Crust</p>
                    </div>
                    <ArchiveIcon className={styles.headArchive} />
                </div>
                <p className={styles.headCreated}>Created {dayjs(data.created_at).fromNow()}</p>
            </header>
            {/* Title */}
            <h2 className={styles.title}>{data.title}</h2>
            {/* Description */}
            <div className={styles.item}>
                <h3 className={styles.name}>Description</h3>
                <p className={clsx(styles.text, styles.description)}>{data.description}</p>
            </div>
            {/* Contact & Department */}
            <div className={styles.item}>
                <ul className={styles['row-2']}>
                    <li className={styles.col}>
                        <h3 className={styles.name}>Point of Contact</h3>
                        <Members
                            users={data.poc_member_id ? [data.poc_member_id] : []}
                            className={styles.contacts}
                            hideMore
                        />
                    </li>
                    <li className={styles.col}>
                        <h3 className={styles.name} data-dark>
                            Department
                        </h3>
                        <p className={clsx(styles.name, styles.department)}>{data.department}</p>
                    </li>
                </ul>
            </div>
            {/* Payout & Min People & Winners */}
            <div className={styles.item}>
                <ul className={styles[type === JobType.BOUNTY ? 'row-3' : 'row-2']}>
                    <li className={styles.col}>
                        <h3 className={styles.name}>Payout</h3>
                        <p className={styles.payout}>
                            <span>{data.payout_amount}</span>
                            <span>{data.payout_currency}</span>
                        </p>
                    </li>
                    <li className={styles.col}>
                        <h3 className={styles.name} data-dark>
                            Minimum of people
                        </h3>
                        <p className={styles.minPeople}>{data.req_people_count}</p>
                    </li>
                    {type === JobType.BOUNTY && (
                        <li className={styles.col}>
                            <h3 className={styles.name}>Number of winners</h3>
                            {/* <p className={styles.winners}>{data.winners_amount || ''}</p> */}
                            <p className={styles.winners}>{''}</p>
                        </li>
                    )}
                </ul>
            </div>
            {/* Deadlines */}
            <div className={styles.item}>
                <ul className={styles['row-2']}>
                    <li className={styles.col}>
                        <h3 className={styles.name}>
                            <CalendarIcon />
                            <span>Start Date</span>
                        </h3>
                        <p className={styles.date}>
                            {dayjs(data.start_date).format('DD MMM YYYY')}
                        </p>
                    </li>
                    <li className={styles.col}>
                        <h3 className={styles.name}>
                            <CalendarIcon />
                            <span>End Date</span>
                        </h3>
                        <p className={styles.date}>{dayjs(data.end_date).format('DD MMM YYYY')}</p>
                    </li>
                </ul>
            </div>
            {/* Github */}
            {type !== JobType.BOUNTY && (
                <div className={styles.item}>
                    <div className={styles.github}>
                        <div className={styles.githubLogo}>
                            <img src="/img/socials/github-3.svg" alt="github" />
                        </div>
                        <a
                            href={data.github}
                            target="_blank"
                            className={styles.githubLink}
                            rel="noreferrer"
                        >
                            {data.github}
                        </a>
                        <LinkIcon className={styles.githubIcon} />
                    </div>
                </div>
            )}
            {/* Attachments */}
            <div className={styles.item}>
                <h3 className={clsx(styles.name, styles.nameAttachments)}>
                    <AttachmentIcon />
                    <span>Attachment</span>
                    <strong>{data?.files?.length}</strong>
                </h3>
                <ul className={styles.attachmentsList}>
                    {data?.files?.slice(0, 4).map((file, index) => (
                        <li className={styles.attachmentsItem} key={index}>
                            <File name={file.name} size={file?.metadata?.size} url={file.url} />
                        </li>
                    ))}
                </ul>
            </div>
            {/* Open To */}
            <div className={styles.item}>
                <h3 className={styles.name}>Open to:</h3>
                <ul className={styles.openToList}>
                    {data?.open_to?.map((role) => (
                        <li className={styles.openToItem} key={role}>
                            <MarkIcon />
                            <span>{role}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Associated To */}
            {type === JobType.TASK && (
                <div className={styles.item}>
                    <h3 className={styles.name}>Associated Project</h3>
                    <p className={styles.associatedTo}>
                        <BookIcon />
                        <span>Sleep app project</span>
                    </p>
                </div>
            )}
            {/* Skills & Tags */}
            <div className={styles.item}>
                <h3 className={styles.name}>Skills</h3>
                <SkillList skills={data.skills} className={styles.skills} />
                <ul className={styles.tags}>
                    {data.tags.map((tag) => (
                        <li className={styles.tagsItem} key={tag}>
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Footer */}
            <footer className={styles.foot}>
                <Button color="green" className={styles.footApplyBtn} onClick={() => onApply(data)}>
                    <JobsBoardIcon />
                    <span>Apply</span>
                </Button>
                <Button color="black" className={styles.footMsgBtn}>
                    <SmsIcon />
                </Button>
            </footer>
        </Popup>
    );
};

export default JobInfo;
