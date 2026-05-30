import React from 'react';
import Button from 'ui/@buttons/Button/Button';
import css from './sidebar-skeleton.module.scss';
import { useNavigate } from 'react-router-dom';

export const EmptyState: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={css.empty} data-analytics-parent="chat_sidebar">
            <img className={css.empty_img} src="/img/add-friend.svg" alt="fr" />

            <p className={css.empty_text}>
                <span>Connect and meet new people in discovery.</span>
                {/* <span>Connect Now!</span> */}
            </p>

            <Button
                className={css.empty_discoverBtn}
                color="orange-outlined"
                onClick={() => navigate(`/discovery/contributor`)}
                data-analytics-click="connect_now_button"
            >
                <span>Connect Now!</span>
            </Button>
        </div>
    );
};
