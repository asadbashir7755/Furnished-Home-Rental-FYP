import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../Styles/Navbar.css';
import logo from "../../assets/logo3.png";
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { UserContext } from '../Context/UserContext';
import { fetchUserReservations } from './API/userreservations';

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [hasReservations, setHasReservations] = useState(false);
  const { user } = useContext(UserContext) || {};
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (user) {
      fetchUserReservations()
        .then(data => {
          // Handle both array and object with reservations property
          const resArr = Array.isArray(data)
            ? data
            : (Array.isArray(data?.reservations) ? data.reservations : []);
          if (mounted) setHasReservations(resArr.length > 0);
        })
        .catch(() => {
          if (mounted) setHasReservations(false);
        });
    } else {
      setHasReservations(false);
    }
    return () => { mounted = false; };
  }, [user]);

  const showSidebar = () => setSidebar(!sidebar);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleManageProfileClick = () => {
    navigate('/profile');
  };

  const handleManageReservationsClick = () => {
    navigate('/userreservations');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <NavLink className="navbar-brand" to="/">
          <img src={logo} width="70" height="70" className="d-inline-block align-top" alt="Logo" />
        </NavLink>
        <button className="navbar-toggler" type="button" onClick={showSidebar}>
          {sidebar ? <FaTimes className="text-dark" /> : <FaBars className="text-dark" />}
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" exact="true" to="/" activeclassname="active">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ourcollections" activeclassname="active">Our Collections</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/featured" activeclassname="active">Featured</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" activeclassname="active">About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contactus" activeclassname="active">Contact Us</NavLink>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <button className="btn btn-primary" onClick={handleManageProfileClick}>Manage Profile</button>
                </li>
                {hasReservations && (
                  <li className="nav-item">
                    <button className="btn btn-secondary" onClick={handleManageReservationsClick}>Manage Reservations</button>
                  </li>
                )}
              </>
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
