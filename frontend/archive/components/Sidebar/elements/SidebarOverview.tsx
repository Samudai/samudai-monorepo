import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import routes from 'root/router/routes';
import { replaceParam } from 'root/router/utils';
import { toggleExtendedSidebar, toggleMenu } from 'store/features/app/slice';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import DashboardAlert from 'components/UserProfile/DashboardAlert';
import RouteLink from 'ui/RouteLink';
import PaymentsIcon from 'ui/SVG/PaymentsIcon';
import ProjectsNoteIcon from 'ui/SVG/ProjectsNoteIcon';
import SearchStatusIcon from 'ui/SVG/SearchStatusIcon';
import SidebarIcons from 'ui/SVG/sidebar';
import JobsBoardIcon from 'ui/SVG/sidebar/JobsBoardIcon';
import TeamIcon from 'ui/SVG/sidebar/TeamIcon';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import '../styles/SidebarOverview.scss';

const SidebarOverview = () => {
  const dispatch = useTypedDispatch();
  const activeDao = useTypedSelector(selectActiveDao);
  const { daoid } = useParams();
  const jobRef = useRef<HTMLAnchorElement>(null);
  const accessActiveDao =
    useTypedSelector(selectAccessList)?.[activeDao!] ===
    AccessEnums.AccessType.MANAGE_DAO;

  const alertPopup = usePopup();

  const onClick = () => {
    dispatch(toggleExtendedSidebar(false));
    dispatch(toggleMenu(false));
  };

  useEffect(() => {
    if (jobRef.current !== null) {
      const ref = jobRef.current;
      ref.classList.remove('active');
    }
  }, []);

  return (
    <div className="sidebar-overview">
      <nav className="sidebar-overview__nav">
        <RouteLink
          onClick={(e) => {
            e.stopPropagation();
            activeDao === '' && alertPopup.open();
            activeDao !== '' && onClick();
          }}
          icon={<SidebarIcons.Dashboard />}
          to={activeDao !== '' ? `/${activeDao}/dashboard/1` : '#'}
          title="Dashboard"
        />
        <RouteLink
          onClick={onClick}
          to={'/' + getMemberId() + `/discovery`}
          icon={<SearchStatusIcon />}
          title="Discovery"
        />
        {accessActiveDao && (
          <RouteLink
            onClick={onClick}
            to={'/' + activeDao + routes.projectsTotal}
            icon={<SidebarIcons.ProjectBoard />}
            title="Projects"
          />
        )}
        {accessActiveDao && (
          <RouteLink
            onClick={onClick}
            to={'/' + activeDao + routes.team}
            icon={<TeamIcon />}
            title="Team"
          />
        )}
        {accessActiveDao && (
          <RouteLink
            onClick={onClick}
            to={'/' + activeDao + routes.dicussions}
            icon={<SidebarIcons.Discussions />}
            title="Discussions"
          />
        )}
        {accessActiveDao && (
          <RouteLink
            onClick={onClick}
            to={'/' + activeDao + routes.payments}
            icon={<PaymentsIcon />}
            title="Payments"
          />
        )}
        {/* RM S */}
         <RouteLink
          refValue={jobRef}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toast('Success', 5000, 'This feature is coming soon!', '')();
          // }}
          to={`/jobs`}
          icon={<JobsBoardIcon />}
          title="Jobs Board"
        />
        <RouteLink
          refValue={jobRef}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toast('Success', 5000, 'This feature is coming soon!', '')();
          // }}
          to={`/messages/${activeDao}`}
          icon={<JobsBoardIcon />}
          title="Feed Board"
        /> 
        <RouteLink
          onClick={onClick}
          to={routes.messages + '/' + activeDao}
          icon={<SidebarIcons.Sms />}
          title="Messages"
        />
        <RouteLink
          onClick={onClick}
          to={routes.rewards}
          icon={<SidebarIcons.Rewards />}
          title="Rewards"
      />
        {/* RM E */}
      </nav>
      <PopupBox active={alertPopup.active} onClose={alertPopup.close}>
        <DashboardAlert onClose={alertPopup.close} />
      </PopupBox>
    </div>
  );
};

export default SidebarOverview;
