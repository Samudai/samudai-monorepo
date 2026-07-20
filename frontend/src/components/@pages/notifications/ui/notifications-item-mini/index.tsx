import dayjs from 'dayjs';
import React from 'react';
import css from './notifications-item-mini.module.scss';
import Sprite from 'components/sprite';

export const NotificationsItemMini: React.FC<any> = (props) => {
    const tags = props.tags?.length ? (
        <div className={css.tags}>
            <ul className={css.tags_list}>
                {props.tags.map((item: any) => (
                    <li className={css.tags_item} key={item}>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    ) : null;

    return (
        <div className={css.root}>
            {(props.type === 'not-8' || props.type === 'not-9' || props.type === 'not-10') && (
                <div className={css.profile_picture}>
                    <img
                        src={props.user?.profile_picture || '/img/icons/user-4.png'}
                        alt={props.user?.name}
                        className="img-cover"
                    />
                </div>
            )}

            <div className={css.content} style={{ width: '100%' }}>
                {props.type === 'not-8' && (
                    <>
                        <h3 className={css.title}>{props.title}</h3>

                        <p className={css.info}>
                            <span>{dayjs(props.date).fromNow()}</span>
                            <span>Heads Up</span>
                        </p>

                        <p className={css.text}>{props.text}</p>

                        <div className={css.controls}>
                            <button className={css.controls_btn} onClick={props.onDelete}>
                                <span>Delete</span>
                            </button>

                            <button className={css.controls_btn} onClick={props.onAccept}>
                                <span>Accept</span>
                            </button>
                        </div>
                    </>
                )}

                {props.type === 'not-9' && (
                    <>
                        <h3 className={css.title}>{props.title}</h3>
                        <p className={css.info}>
                            <span>{dayjs(props.date).fromNow()}</span>
                            {/* <span>Heads Up</span> */}
                        </p>
                    </>
                )}

                {props.type === 'not-10' && (
                    <>
                        <div style={{ display: 'flex' }}>
                            <div>
                                <h2 className={css.title}>{props.user?.name}</h2>
                                <p className={css.info}>
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
                                    <Sprite url="/img/sprite.svg#cross-circle" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {(props.type === 'not-8' || props.type === 'not-9') && tags}
            </div>
        </div>
    );
};
