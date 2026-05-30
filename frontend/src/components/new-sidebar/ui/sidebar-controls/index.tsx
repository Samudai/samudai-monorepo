import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import HelpCenterIcon from 'ui/SVG/HelpCenterIcon';
import Settings from 'ui/SVG/Settings';
import { getMemberId } from 'utils/utils';
import css from './sidebar-controls.module.scss';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import {
    selectActiveDao,
    selectAccess,
    changeTutorialStep,
    tutorialStep,
} from 'store/features/common/slice';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import LogoutIcon from 'ui/SVG/logout.icon';
import { useNavigate } from 'react-router-dom';
import { usePrivy, useLogout } from '@privy-io/react-auth';
import Tutorial from 'ui/tutorial';

interface SidebarControlsProps {
    extended: boolean;
    noSettings?: boolean;
    onShrinkMenu: () => void;
}

interface ControlsBoxProps {
    noTutorial?: boolean;
}

const ControlsBox: React.FC<ControlsBoxProps> = ({ noTutorial }) => {
    const activeDao = useTypedSelector(selectActiveDao);
    const dispatch = useTypedDispatch();

    return (
        <div className={css.controls_help_box} data-anlytics-click="control_box_menu">
            {!noTutorial && (
                <NavLink
                    className={css.controls_help_item}
                    to={''}
                    onClick={() => dispatch(changeTutorialStep({ step: 1 }))}
                    data-analytics-click="FAQ"
                >
                    Tutorial
                </NavLink>
            )}
            <NavLink
                className={css.controls_help_item}
                to="https://samudai.gitbook.io/samudai-playbook/"
                target="_blank"
                data-analytics-click="FAQ"
            >
                Guidebook
            </NavLink>
            <NavLink
                className={css.controls_help_item}
                to={`/${process.env.REACT_APP_FORM_ID}/form`}
                data-analytics-click="report_a_bug"
            >
                Report a Bug
            </NavLink>
            <NavLink
                className={css.controls_help_item}
                to="https://calendly.com/kushagra_agarwal/feedback"
                target="_blank"
                data-analytics-click="talk_to_us"
            >
                Talk to Us
            </NavLink>
        </div>
    );
};

export const SidebarControls: React.FC<SidebarControlsProps> = ({
    extended,
    noSettings,
    onShrinkMenu,
}) => {
    const [helpActive, setHelpActive] = useState(false);
    const buttonRef = useClickOutside<HTMLDivElement>(() => setHelpActive(false));
    const helpMenuRef = useRef<HTMLDivElement>(null);
    const activeDao = useTypedSelector(selectActiveDao);
    const accessDao = useTypedSelector(selectAccess);
    const navigate = useNavigate();
    const { ready, authenticated } = usePrivy();
    const currTutorialStep = useTypedSelector(tutorialStep);
    const dispatch = useTypedDispatch();

    const toggleActive = () => setHelpActive(!helpActive);

    const { logout } = useLogout({
        onSuccess: () => {
            console.log('User logged out');
        },
    });

    const handleLogout = () => {
        if (ready && authenticated) {
            logout();
        }
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        if (!extended) {
            setHelpActive(false);
        }
    }, [extended]);

    useEffect(() => {
        if (!helpMenuRef.current) return;
        const helpEl = helpMenuRef.current;
        helpEl.style.height = `${helpActive && extended ? helpEl.scrollHeight : 0}px`;
    }, [helpActive]);

    return (
        <div
            className={clsx(
                css.controls,
                extended && css.controlsExtended,
                helpActive && css.controlsHelpActive
            )}
        >
            <div className={css.controls_box} data-analytics-parent="sidebar_settings">
                <div className={css.controls_wrap_btn} id="help_centre" ref={buttonRef}>
                    <button
                        className={`${css.controls_btn} ${css.controls_btnHelp}`}
                        onClick={toggleActive}
                        data-analytics-click="help_center_icon"
                    >
                        <HelpCenterIcon />
                        <span>Help Center</span>
                        <strong>
                            <ArrowLeftIcon />
                        </strong>
                    </button>
                    <div
                        className={css.controls_help}
                        ref={helpMenuRef}
                        data-analytics-parent="controls_box"
                    >
                        <ControlsBox noTutorial={noSettings} />
                    </div>
                    {!extended && (
                        <div className={css.controls_help_standard}>
                            <ControlsBox noTutorial={noSettings} />
                        </div>
                    )}
                </div>
                <Tutorial
                    id="help_centre"
                    active={currTutorialStep === 0}
                    step={{
                        id: 0,
                        name: 'You can always access tutorials here',
                        description: 'Always accessible in the support section.',
                    }}
                    totalSteps={5}
                    position="right-top"
                    onClose={() => dispatch(changeTutorialStep({ step: -1 }))}
                />
                {!noSettings && (
                    <NavLink
                        to={
                            !!activeDao && accessDao?.includes(AccessEnums.AccessType.MANAGE_DAO)
                                ? '/' + activeDao + '/settings/dao'
                                : '/' + getMemberId() + '/settings/contributor'
                        }
                        className={css.controls_btn}
                        onClick={onShrinkMenu}
                        data-analytics-click="settings_button"
                    >
                        <Settings />
                        <span>Settings</span>
                    </NavLink>
                )}
                <div>
                    <button
                        className={css.controls_btn}
                        onClick={handleLogout}
                        style={{ marginTop: '9px' }}
                    >
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
