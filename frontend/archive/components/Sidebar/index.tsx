import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { selectApp, toggleExtendedSidebar } from 'store/features/app/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Sidebar from './Sidebar';
import styles from './styles/sidebar-group.module.scss';

interface SidebarGroupProps {}

const SidebarGroup: React.FC<SidebarGroupProps> = (props) => {
  const [inputFocus, setInputFocus] = useState(false);
  const { extendedSidebarActive } = useTypedSelector(selectApp);
  const dispatch = useTypedDispatch();

  const handleEnter = () => {
    dispatch(toggleExtendedSidebar(true));
  };

  const handleLeave = () => {
    dispatch(toggleExtendedSidebar(false));
  };

  return (
    <div
      className={styles.root}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Sidebar mini />
      <Sidebar
        className={clsx(
          styles.sidebarOnHover, extendedSidebarActive && styles.sidebarActive
        )}
        onFocus={setInputFocus}
      />
    </div>
  );
};

export default SidebarGroup;
