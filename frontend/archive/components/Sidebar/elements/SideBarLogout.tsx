import React from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/SidebarNewProject.scss';

const SideBarLogout = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <button
        {...props}
        onClick={() => {
          localStorage.clear();
          navigate('/signup');
        }}
      >
        <div className="sidebar-newproject__wrap">
          <div className="sidebar-newproject__plus" style={{ background: '#FDC087' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 1 21 21">
              <path
                strokeWidth="4"
                d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"
              />
            </svg>
          </div>
        </div>
      </button>
    </React.Fragment>
  );
};

export default SideBarLogout;
