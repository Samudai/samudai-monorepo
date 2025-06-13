import React from 'react';
import { NavLink } from 'react-router-dom';

export const ProfilesItem: React.FC<any> = ({ member_id, profile_picture, name, rating }) => {
    return (
        <div className="cb-profiles-slide">
            <div className="cb-profiles-slide__img">
                <img
                    className="img-cover"
                    src={profile_picture || '/img/icons/user-4.png'}
                    alt="avatar"
                />
            </div>
            <h4 className="cb-profiles-slide__name" style={{ marginBottom: '10px' }}>
                {name}
            </h4>
            {/* <p className="cb-profiles-slide__rate">
        Rating <strong>{!!rating ? rating : ''}</strong>
      </p> */}
            <NavLink
                to={`/${member_id}/profile`}
                className="cb-profiles-slide__profile-link"
                data-analytics-click="view_profile_button"
            >
                View Profile
            </NavLink>
        </div>
    );
};
