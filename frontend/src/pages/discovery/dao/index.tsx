import { useNavigate } from 'react-router-dom';
import {
    selectAccess,
    selectAccessList,
    selectActiveDao,
    selectDaoProgress,
} from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import {
    DaoCollaborations,
    DaoInformation,
    DaoJobs,
    DaoReviews,
} from 'components/@pages/discovery-dao';
import useFetchDao from 'components/@pages/new-discovery/lib/hooks/use-fetch-dao';
import Button from 'ui/@buttons/Button/Button';
import Head from 'ui/head';
import css from './dao.module.scss';
import { useProgress } from 'hooks/use-progress';
import { toast } from 'utils/toast';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import CollaborateRequest from 'components/@popups/CollaborateRequest/CollaborateRequest';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { getMemberId } from 'utils/utils';
import Settings from 'ui/SVG/Settings';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';

const Dao = () => {
    const { daoData, isMember } = useFetchDao();
    const navigate = useNavigate();
    const currDao = useTypedSelector(selectActiveDao);
    const currAccess = useTypedSelector(selectAccess);
    const daoProgressStatus = useTypedSelector(selectDaoProgress);
    const accessList = useTypedSelector(selectAccessList);
    const access =
        !!daoData?.dao_id &&
        accessList[daoData.dao_id]?.includes(AccessEnums.AccessType.MANAGE_DAO);

    const handleClickOnJoinDao = () => {
        mixpanel.track('join_dao_clicked', {
            dao_id: daoData?.dao_id,
            member_id: getMemberId(),
            timestamp: new Date().toUTCString(),
        });
        if (daoData?.join_dao_link) {
            window.open(daoData?.join_dao_link, '_blank');
        }
    };

    const requestCollaborateModal = usePopup();

    const { daoProgress, memberType, trialDashboard } = useProgress();

    return (
        <div className={css.dao} data-analytics-page="discovery_dao">
            <Head
                breadcrumbs={[
                    { name: 'Discovery' },
                    { name: 'DAO', href: '/discovery/dao' },
                    { name: daoData?.name || '' },
                ]}
                dataParentId="header"
            >
                <div className={css.head_row}>
                    <Head.Title title={daoData?.name || ''} />
                    <div className={css.head_controls}>
                        {/* {currDao !== daoData?.dao_id &&
                            currAccess &&
                            daoData?.open_to_collaboration && (
                                <div
                                    style={{ marginRight: '24px' }}
                                    onClick={
                                        !daoProgressStatus.collaboration_pass_claim
                                            ? () => {
                                                  return toast(
                                                      'Attention',
                                                      3000,
                                                      'Collect collaboration pass to unlock Collaborate',
                                                      ''
                                                  )();
                                              }
                                            : daoData.collaborations.some(
                                                  (item) => item.dao_id === currDao
                                              )
                                            ? () => {
                                                  return toast(
                                                      'Attention',
                                                      3000,
                                                      'Collaboration already exists',
                                                      ''
                                                  )();
                                              }
                                            : undefined
                                    }
                                >
                                    <Button
                                        className={css.collaborateBtn}
                                        color="green-outlined"
                                        onClick={requestCollaborateModal.open}
                                        disabled={
                                            !daoProgressStatus.collaboration_pass_claim ||
                                            daoData.collaborations.some(
                                                (item) => item.dao_id === currDao
                                            )
                                        }
                                    >
                                        <Sprite url="/img/sprite.svg#collaborate" />
                                        <span>Collaborate</span>
                                    </Button>
                                </div>
                            )} */}

                        {isMember ? (
                            <Button
                                className={css.joinBtn}
                                color="orange-outlined"
                                style={{ cursor: 'default' }}
                            >
                                <span>Joined</span>
                            </Button>
                        ) : (
                            <div
                                onClick={() => {
                                    if (!daoData?.join_dao_link) {
                                        return toast(
                                            'Attention',
                                            3000,
                                            'DAO is currently not looking for new participants',
                                            ''
                                        )();
                                    }
                                }}
                            >
                                <Button
                                    className={css.joinBtn}
                                    color="green"
                                    onClick={() => handleClickOnJoinDao()}
                                    disabled={!daoData?.join_dao_link}
                                    data-analytics-click="join_dao_from_discovery_btn"
                                >
                                    <span>Join DAO</span>
                                </Button>
                            </div>
                        )}

                        {access && (
                            <button
                                className={css.editBtn}
                                onClick={() => navigate(`/${daoData?.dao_id}/settings/dao`)}
                                data-analytics-click="navigate_to_dao_profile_from_discovery_btn"
                            >
                                <Settings />
                            </button>
                        )}
                    </div>
                </div>
            </Head>
            <div className="container">
                <div className={css.content}>
                    <div className={css.content_info}>
                        <DaoInformation />
                    </div>

                    <div className={css.content_widgets}>
                        <div className={css.content_item}>
                            <DaoJobs />
                        </div>

                        <div className={css.content_item}>
                            <DaoReviews />
                        </div>

                        <div className={css.content_item}>
                            <DaoCollaborations />
                        </div>
                    </div>
                </div>
            </div>
            <PopupBox
                active={requestCollaborateModal.active}
                onClose={requestCollaborateModal.close}
            >
                <CollaborateRequest
                    fromDaoId={currDao}
                    toDaoId={daoData?.dao_id || ''}
                    onClose={requestCollaborateModal.close}
                />
            </PopupBox>
        </div>
    );
};

export default Dao;
