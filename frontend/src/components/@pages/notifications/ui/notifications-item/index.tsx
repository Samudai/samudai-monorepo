import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import Sprite from 'components/sprite';
import dayjs from 'dayjs';
import React from 'react';
import Button from 'ui/@buttons/Button/Button';
import { NotificationsVotes } from '../notifications-votes';
import css from './notifications-item.module.scss';
import { NotificationProps } from './types';

export const NotificationsItem: React.FC<NotificationProps> = (props) => {
    const tags = props.tags?.length ? (
        <div className={css.tags}>
            <ul className={css.tags_list}>
                {props.tags.map((item) => (
                    <li className={css.tags_item} key={item}>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    ) : null;

    return (
        <div className={css.root}>
            <div className={css.row} style={props.type === 'not-1' ? { height: '60px' } : {}}>
                {props.type === 'not-1' && (
                    <>
                        <div className={css.user} style={{ width: '20%' }}>
                            {props.user && (
                                <div
                                    className={css.col_main}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <div className={css.user_picture}>
                                        <img
                                            src={
                                                props.user.profile_picture ||
                                                '/img/icons/user-4.png'
                                            }
                                            alt="pictur"
                                            className="user"
                                            style={{ borderRadius: '50%' }}
                                        />
                                    </div>

                                    <div className={css.user_content}>
                                        <h4 className={css.user_name}>{props.user.name}</h4>
                                        <p className={css.user_location}>{props.user.location}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!!props?.rating && (
                            <div className={css.col_rating}>
                                <p className={css.rating} data-rating={props.rating.toLowerCase()}>
                                    {props.rating}
                                </p>
                            </div>
                        )}

                        <div className={css.col_text} style={{ width: '50%' }}>
                            <p className={css.text}>{props.text}</p>
                        </div>

                        <div className={css.col_date} style={{ width: '20%' }}>
                            <p className={css.date}>{dayjs(props.date).format('DD MMM YYYY')}</p>
                        </div>

                        {/* <div className={css.col_id}>
                            <span>@{props.id}</span>
                        </div> */}

                        <div className={css.col_view} style={{ width: '10%' }}>
                            <Button
                                className={css.viewBtn}
                                color="black"
                                onClick={props.onView}
                                disabled={!props.onView}
                            >
                                <span>View</span>
                            </Button>
                        </div>
                    </>
                )}

                {props.type === 'not-2' && (
                    <>
                        <div className={css.col_main}>
                            <div className={css.user}>
                                <div className={css.user_picture}>
                                    <img
                                        src={props.user.profile_picture || '/img/icons/user-4.png'}
                                        alt="pictur"
                                        className="user"
                                    />
                                </div>

                                <div className={css.user_content}>
                                    <h4 className={css.user_name}>{props.user.name}</h4>
                                </div>
                            </div>
                        </div>

                        <div className={css.col_382}>
                            <p className={css.text}>Incoming Connection Request</p>
                        </div>

                        <div className={css.col_152}>
                            <p className={css.date}>{dayjs(props.date).fromNow()}</p>
                        </div>

                        <div className={css.col_controls}>
                            {props.onCancel && (
                                <Button className={css.cancelBtn} color="black">
                                    <span>Cancel</span>
                                </Button>
                            )}

                            {props.onConfirm && (
                                <Button className={css.confirmBtn} color="green">
                                    <span>Confirm</span>
                                </Button>
                            )}
                        </div>
                    </>
                )}

                {props.type === 'not-3' && (
                    <>
                        <div className={css.col_main}>
                            <p className={css.category}>{props.category}</p>
                            <h3 className={css.title}>{props.title}</h3>
                        </div>

                        <div className={css.col_project}>
                            <div className={css.project}>
                                <h4 className={css.project_title}>Project</h4>
                                <p className={css.project_name}>{props.projectName}</p>
                            </div>
                        </div>

                        <div className={css.col_status}>
                            <p className={css.status_old}>In - Review</p>
                        </div>

                        <div className={css.col_status}>
                            <p className={css.status_new}>Design</p>
                        </div>

                        <div className={css.col_132}>
                            <p className={css.date}>{dayjs(props.date).fromNow()}</p>
                        </div>

                        <div className={css.col_132}>
                            <ProjectsMember values={props.members as any} size={30} disabled />
                        </div>

                        <div className={css.col_view}>
                            <Button className={css.viewGreenBtn} color="green">
                                <span>View</span>
                            </Button>
                        </div>
                    </>
                )}

                {props.type === 'not-6' && (
                    <>
                        <div className={css.col_main}>
                            <h3 className={css.interview_title}>
                                <span>{props.title}</span>
                            </h3>
                        </div>

                        <div className={css.col_175}>
                            <p className={css.tile}>
                                <Sprite url="/img/sprite.svg#location" />
                                <span>{props.location}</span>
                            </p>
                        </div>

                        <div className={css.col_195}>
                            <p className={css.tile}>
                                <Sprite url="/img/sprite.svg#calendar" />
                                <span>{dayjs(props.startDate).format('ddd, DD MMM, YYYY')}</span>
                            </p>
                        </div>

                        <div className={css.col_195}>
                            <p className={css.tile}>
                                <Sprite url="/img/sprite.svg#clock" />
                                <span>09:00 - 11:00 AM </span>
                            </p>
                        </div>

                        <div className={css.col_90}>
                            <p className={css.date}>{dayjs(props.date).fromNow()}</p>
                        </div>

                        <div className={css.col_details}>
                            <Button className={css.viewDetailsBtn} color="green">
                                <span>View details</span>
                            </Button>
                        </div>
                    </>
                )}

                {props.type === 'not-7' && (
                    <>
                        <div className={css.col_main}>
                            <h3 className={css.title}>{props.title}</h3>
                        </div>

                        <div className={css.col_170}>
                            <NotificationsVotes
                                count={props.votesFor}
                                percent={
                                    (props.votesFor / (props.votesFor + props.votesAgain)) * 100
                                }
                            />
                        </div>

                        <div className={css.col_170}>
                            <NotificationsVotes
                                count={props.votesAgain}
                                percent={
                                    (props.votesAgain / (props.votesFor + props.votesAgain)) * 100
                                }
                                color="#FDC087"
                            />
                        </div>

                        <div className={css.col_openstatus}>
                            <div
                                className={css.openstatus}
                                data-status={props.status.toLowerCase()}
                            >
                                <span>{props.status}</span>
                            </div>
                        </div>

                        <div className={css.col_170}>
                            <p className={css.date}>{dayjs(props.date).fromNow()}</p>
                        </div>

                        <div className={css.col_arrows}>
                            <div className={css.arrow}>
                                <Sprite
                                    style={{
                                        stroke: '#FDC087',
                                    }}
                                    url="/img/sprite.svg#arrow-down-long"
                                />
                            </div>

                            <div className={css.arrow}>
                                <Sprite
                                    style={{
                                        stroke: '#B2FFC3',
                                        transform: 'scaleY(-1)',
                                    }}
                                    url="/img/sprite.svg#arrow-down-long"
                                />
                            </div>
                        </div>
                    </>
                )}

                {props.type === 'not-10' && (
                    <>
                        <div className={css.user} style={{ width: '98%', padding: '8px' }}>
                            {props.user && (
                                <div
                                    className={css.col_main}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <div className={css.user_picture}>
                                        <img
                                            src={
                                                props.user.profile_picture ||
                                                '/img/icons/user-4.png'
                                            }
                                            alt="pictur"
                                            className="user"
                                            style={{ borderRadius: '50%' }}
                                        />
                                    </div>

                                    <div
                                        className={css.user_content}
                                        style={{ marginLeft: '15px' }}
                                    >
                                        <h4 className={css.user_name}>{props.user.name}</h4>
                                        <p className={css.user_location}>
                                            <span>{props.user?.role || 'User'}</span>
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <button className={css.accept_btn} onClick={props.onAccept}>
                                            <span>Accept</span>
                                        </button>
                                        <button className={css.reject_btn} onClick={props.onReject}>
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {props.type != 'not-10' && tags}
        </div>
    );
};
