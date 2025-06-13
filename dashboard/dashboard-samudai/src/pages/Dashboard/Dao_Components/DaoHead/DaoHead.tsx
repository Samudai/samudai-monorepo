import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types/';
import {
    changeTutorialStep,
    selectAccess,
    selectAccessList,
    selectActiveDao,
    selectActiveDaoName,
    tutorialStep,
} from 'store/features/common/slice';
import { selectDaoViewActive, togglePrivateView } from 'store/features/dao/slice';
import { useLazyGetDaoByDaoIdQuery } from 'store/services/Dao/dao';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import AddWidget from 'components/@popups/AddWidget/AddWidget';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import SharePopUp from 'components/UserProfile/InviteMembersPopUp';
import Button from 'ui/@buttons/Button/Button';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import PersonAddIcon from 'ui/SVG/PersonAddIcon';
import SettingsIcon from 'ui/SVG/SettingsV2Icon';
import Head from 'ui/head';
import './DaoHead.scss';
import DaoProgress from 'ui/new-progress-bar/DaoProgress';
import Tutorial from 'ui/tutorial';
import { addCurrSubscription, updateCurrBillingDao } from 'store/features/billing/billingSlice';

const DaoHead: React.FC = () => {
    const addWidget = usePopup();
    const disscussion = usePopup();
    const { daoid } = useParams();
    const { id, is_private } = useTypedSelector(selectDaoViewActive);
    const activeDaoName = useTypedSelector(selectActiveDaoName);
    const [daoName, setDaoName] = useState('Dao');
    const dispatch = useTypedDispatch();
    const memberType = localStorage.getItem('account_type');
    const activeDao = useTypedSelector(selectActiveDao);
    const accessDao = useTypedSelector(selectAccess);
    const currTutorialStep = useTypedSelector(tutorialStep);
    const navigate = useNavigate();

    const [daoData] = useLazyGetDaoByDaoIdQuery();
    const [loaded, setLoaded] = useState(false);
    const onTogglePrivate = () => {
        dispatch(togglePrivateView(id));
    };
    const share = usePopup();

    useEffect(() => {
        const fn = async () => {
            try {
                const data = await daoData(daoid!).unwrap();
                setDaoName(data.data!.dao.name);
                if (data.data?.dao.subscription) {
                    dispatch(addCurrSubscription(data.data?.dao.subscription));
                    dispatch(updateCurrBillingDao(daoid!));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fn();
    }, [daoid]);

    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    return (
        <>
            <Head
                breadcrumbs={[
                    { name: 'Workspace' },
                    {
                        name: 'Dashboard',
                        href: `/${daoid}/dashboard/1`,
                        disabled: true,
                    },
                    { name: activeDaoName },
                ]}
                data-analytics-page="dao_dashboard"
            >
                <>
                    {memberType === 'admin' &&
                        !!activeDao &&
                        accessDao?.includes(AccessEnums.AccessType.MANAGE_DAO) && (
                            <div style={{ marginBottom: '24px' }}>
                                <DaoProgress />
                            </div>
                        )}
                    <div className="page-dao__header" data-analytics-parent="dashboard_header">
                        <Head.Title title={`${daoName} Activity Dashboard`} />
                        {/* {access && (
                        <div className="page-dao__header-left">
                            <button className="page-dao__header-private">
                                <span>Private</span>
                                <Switch className="page-dao__header-private-switch" active={true} />
                            </button>
                        </div>
                    )} */}
                        <div className="page-dao__header-right">
                            {access && (
                                <button
                                    className="page-dao-header-collaborate"
                                    onClick={share.open}
                                    data-analytics-click="invite_button"
                                >
                                    <PersonAddIcon />
                                    <span>Invite</span>
                                </button>
                            )}
                            <div className="page-dao__widget">
                                {access && (
                                    <>
                                        <Button
                                            id="addwidget-btn"
                                            className="page-dao__widget-btn"
                                            onClick={addWidget.toggle}
                                            data-analytics-click="customize_button"
                                        >
                                            <SettingsIcon />
                                            Customize
                                        </Button>
                                        <AddWidget
                                            active={addWidget.active}
                                            onClose={addWidget.toggle}
                                            className="page-dao__widget-popup"
                                        />
                                    </>
                                )}
                            </div>
                            <NavLink
                                to={`/discovery/dao/${daoid}`}
                                className="page-dao__go-to-profile"
                                id="go-to-profile"
                            >
                                <span data-analytics-click="go_to_profile_button">
                                    Go to Profile
                                </span>
                                <ArrowLeftIcon />
                            </NavLink>
                            <Tutorial
                                id="go-to-profile"
                                active={currTutorialStep === 11}
                                step={{
                                    name: 'Let’s head to Complete the DAO Profile!',
                                    description:
                                        'A complete DAO Profile enables you to connect with other DAOs and puts you DAO on the map.',
                                    action: {
                                        name: `Let's Go`,
                                        onClick: () => {
                                            navigate(`/discovery/dao/${daoid}`);
                                            dispatch(changeTutorialStep({ step: -1 }));
                                        },
                                    },
                                }}
                                totalSteps={6}
                                position="bottom-right"
                                onClose={() => dispatch(changeTutorialStep({ step: -1 }))}
                            />
                        </div>
                    </div>
                </>
            </Head>

            {/* <PopupBox active={disscussion.active} onClose={disscussion.toggle}>
                <CollaborateRequest />
            </PopupBox> */}
            <PopupBox active={share.active} onClose={share.toggle}>
                <SharePopUp onClose={share.close} />
            </PopupBox>
        </>
    );
};

export default DaoHead;
