import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../Styles/Sidebar.css';
import { FaTimes, FaHome, FaEnvelope, FaCog } from 'react-icons/fa'; // Import professional icons
import { UserContext } from '../Context/UserContext';

const Sidebar = ({ sidebar, showSidebar }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
    showSidebar();
  };

  const handleManageProfileClick = () => {
    navigate('/profile');
    showSidebar();
  };

  return (
    <div className={sidebar ? 'sidebar active' : 'sidebar'}>
      <div className="sidebar-header">
        <FaTimes className="sidebar-close" onClick={showSidebar} />
      </div>
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <NavLink className="sidebar-link" exact to="/" onClick={showSidebar}>
            <FaHome className="sidebar-icon" />
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink className="sidebar-link" to="/contactus" onClick={showSidebar}>
            <FaEnvelope className="sidebar-icon" />
          </NavLink>
        </li>
        {user ? (
          <li className="sidebar-item">
            <button className="btn btn-primary" onClick={handleManageProfileClick}>
              <FaCog className="sidebar-icon" />
            </button>
          </li>
        ) : (
          <li className="sidebar-item">
            <button className="btn btn-primary" onClick={handleLoginClick}>
              <FaCog className="sidebar-icon" />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
