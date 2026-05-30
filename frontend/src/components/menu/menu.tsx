import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { selectMenu, toggleMenu } from 'store/features/app/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import styles from './menu.module.scss';
// import Sidebar from 'components/Sidebar/Sidebar';

interface MenuProps {}

const Menu: React.FC<MenuProps> = (props) => {
    const menuActive = useTypedSelector(selectMenu);
    const dispatch = useTypedDispatch();

    return (
        <CSSTransition in={menuActive} timeout={400} classNames={styles} mountOnEnter unmountOnExit>
            <div className={styles.menu}>
                <header className={styles.menu_head}>
                    <div className={styles.menu_logo}>
                        <img src={require('images/logo.png')} alt="logo" />
                        <span>Menu</span>
                    </div>
                    <button
                        className={styles.menu_exit}
                        onClick={() => dispatch(toggleMenu(false))}
                    />
                </header>
                {/* <Sidebar className={styles.menu_sidebar} /> */}
            </div>
        </CSSTransition>
    );
};

export default Menu;
