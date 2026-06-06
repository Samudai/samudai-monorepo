import React from 'react';
import { DaoSocials } from '../dao-socials';
import { DaoTeam } from '../dao-team';
import Sprite from 'components/sprite';
import Button from 'ui/@buttons/Button/Button';
import UserSkill from 'ui/UserSkill/UserSkill';
import css from './dao-information.module.scss';
import { Skeleton } from 'components/new-skeleton';
import useFetchDao from 'components/@pages/new-discovery/lib/hooks/use-fetch-dao';
import SharePopUp from 'components/UserProfile/InviteMembersPopUp';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { JobsChat } from 'components/@pages/new-jobs';
import { toast } from 'utils/toast';
import { useNavigate } from 'react-router-dom';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

interface DaoInformationProps {}

export const DaoInformation: React.FC<DaoInformationProps> = (props) => {
    const { daoData, isMember, loading } = useFetchDao();
    const navigate = useNavigate();
    const share = usePopup();
    const assigneesState = usePopup<{
        member: IMember;
    }>();

    const handlePocContact = () => {
        if (daoData?.poc_member?.member_id) {
            assigneesState.open({ member: daoData.poc_member });
        } else {
            toast('Failure', 5000, 'No POC assigned', '')();
        }
    };

    if (loading) {
        return (
            <div className={css.dao}>
                <Skeleton
                    styles={{
                        height: 98,
                        borderRadius: 8,
                    }}
                />

                <Skeleton
                    styles={{
                        height: 150,
                        borderRadius: 8,
                        marginTop: 40,
                    }}
                />

                <Skeleton
                    styles={{
                        height: 56,
                        borderRadius: 8,
                        marginTop: 40,
                    }}
                />

                <Skeleton
                    styles={{
                        height: 81,
                        borderRadius: 8,
                        marginTop: 40,
                    }}
                />

                <Skeleton
                    styles={{
                        height: 56,
                        borderRadius: 8,
                        marginTop: 40,
                    }}
                />

                <div className={css.item}>
                    <div className={css.item_row}>
                        <Skeleton
                            styles={{
                                height: 56,
                                borderRadius: 20,
                                maxWidth: 257,
                            }}
                        />

                        <Skeleton
                            styles={{
                                marginLeft: 'auto',
                                height: 56,
                                borderRadius: 20,
                                maxWidth: 257,
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={css.dao}>
            <header className={css.head}>
                <div className={css.head_img}>
                    <img
                        src={daoData?.profile_picture || '/mockup/img/clan-logo-1.png'}
                        alt="dao avatar"
                        className="img-cover"
                    />
                </div>

                <div className={css.head_right}>
                    <div className={css.socials}>
                        <DaoSocials socials={daoData?.socials || []} />

                        {!isMember && (
                            <button className={css.aboutUsBtn} onClick={handlePocContact}>
                                <span className={css.aboutUsBtn_img}>
                                    <img
                                        src={
                                            daoData?.poc_member?.profile_picture ||
                                            '/img/icons/user-4.png'
                                        }
                                        alt="user"
                                        className="img-cover"
                                    />
                                </span>

                                <span className={css.aboutUsBtn_text}>Get to know us</span>

                                <Sprite
                                    url="/img/sprite.svg#arrow-right"
                                    className={css.aboutUsBtn_arrow}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {isMember && (
                <div className={css.controls}>
                    <button className={css.aboutUsBtn} onClick={handlePocContact}>
                        <span className={css.aboutUsBtn_img}>
                            <img
                                src={
                                    daoData?.poc_member?.profile_picture || '/img/icons/user-4.png'
                                }
                                alt="user"
                                className="img-cover"
                            />
                        </span>

                        <span className={css.aboutUsBtn_text}>Get to know us</span>

                        <Sprite
                            url="/img/sprite.svg#arrow-right"
                            className={css.aboutUsBtn_arrow}
                        />
                    </button>

                    {/* <button className={css.controls_collaborateBtn}>
                        <Sprite url="/img/sprite.svg#collaborate" />
                        <span>Collaborate</span>
                    </button> */}

                    {/* <button className={css.controls_inviteBtn}>
                        <Sprite url="/img/sprite.svg#user-add" />
                        <span>Invite</span>
                    </button> */}

                    <Button
                        className={css.controls_joinBtn}
                        color="green"
                        onClick={() => navigate(`/${daoData?.dao_id}/dashboard/1`)}
                    >
                        <span>Go to Dashboard</span>
                        <Sprite url="/img/sprite.svg#arrow-right" />
                    </Button>
                </div>
            )}

            <div className={css.item}>
                <h4 className={css.subtitle}>BIO</h4>
                <p className={css.description}>{daoData?.about}</p>
            </div>

            <div className={css.item}>
                <h4 className={css.subtitle}>Team</h4>

                <div className={css.item_row}>
                    <DaoTeam members={daoData?.members || []} maxShow={6} />

                    <Button className={css.inviteBtn} color="green-outlined" onClick={share.open}>
                        <Sprite url="/img/sprite.svg#user-add" />
                        <span>Invite</span>
                    </Button>
                </div>
            </div>

            <div className={css.item}>
                <h4 className={css.subtitle}>Type of work</h4>
                <ul className={css.works}>
                    {daoData?.tags?.map((item) => (
                        <li className={css.works_item} key={item}>
                            <UserSkill skill={item} hideCross />
                        </li>
                    ))}
                </ul>
            </div>

            {/* <div className={css.item}>
                <div className={css.item_row}>
                    
                    <div className={css.avg}>
                        <Sprite className={css.avg_icon} url="/img/sprite.svg#coin" />

                        <p className={css.avg_text}>
                            <span>Avg</span>
                            <span>Payment time</span>
                        </p>

                        <p className={css.avg_value}>
                            <span>30</span>{' '}
                            <span>Days</span>
                        </p>
                    </div>

                    <div className={css.avg}>
                        <Sprite className={css.avg_icon} url="/img/sprite.svg#coin" />

                        <p className={css.avg_text}>
                            <span>Avg</span>
                            <span>Payment time</span>
                        </p>

                        <p className={css.avg_value}>
                            <span>30</span>{' '}
                            <span>Days</span>
                        </p>
                    </div>

                </div>
            </div> */}
            <PopupBox active={share.active} onClose={share.toggle}>
                <SharePopUp onClose={share.close} />
            </PopupBox>
            {assigneesState.payload?.member && (
                <PopupBox
                    active={assigneesState.active}
                    onClose={assigneesState.close}
                    effect="side"
                    children={
                        <JobsChat
                            member={assigneesState.payload.member}
                            onClose={assigneesState.close}
                        />
                    }
                />
            )}
        </div>
    );
};
