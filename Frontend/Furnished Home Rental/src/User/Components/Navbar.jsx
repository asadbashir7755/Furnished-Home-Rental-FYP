import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../Styles/Navbar.css';
import logo from "../../assets/logo3.png";
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { UserContext } from '../Context/UserContext';

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useContext(UserContext) || {}; // Ensure user is defined
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleManageProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <a className="navbar-brand" href="#">
          <img src={logo} width="70" height="70" className="d-inline-block align-top" alt="Logo" />
        </a>
        <button className="navbar-toggler" type="button" onClick={showSidebar}>
          {sidebar ? <FaTimes className="text-dark" /> : <FaBars className="text-dark" />}
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/" activeClassName="active">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/properties" activeClassName="active">Our Properties</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" activeClassName="active">About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contactus" activeClassName="active">Contact Us</NavLink>
            </li>
            {user ? (
              <li className="nav-item">
                <button className="btn btn-primary" onClick={handleManageProfileClick}>Manage Profile</button>
              </li>
            ) : (
              <li className="nav-item">
                <button className="btn btn-primary" onClick={handleLoginClick}>Login</button>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <Sidebar sidebar={sidebar} showSidebar={showSidebar} user={user} />
    </>
  );
}

export default Navbar;
