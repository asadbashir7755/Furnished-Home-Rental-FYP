import React, { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { API_BASE_URL } from '../../../config/apiconfig';
import { Card, Button, Modal } from 'antd'; // Import Ant Design components
import '../../Styles/ProfilePage.css'; // Import custom styles

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      onOk: async () => {
        try {
          await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
          setUser(null);
          toast.success("Logout successful!", {
            position: "top-right",
            autoClose: 5000,
            transition: Slide,
          });
          navigate("/login");
        } catch (error) {
          toast.error("Error during logout!", {
            position: "top-right",
            autoClose: 5000,
            transition: Slide,
          });
        }
      },
    });
  };

  return (
    <div className="profile-container">
      <Card className="profile-card" title="Profile" bordered={false}>
        <p className="card-text"><strong>Name:</strong> {user.name}</p>
        <p className="card-text"><strong>Email:</strong> {user.email}</p>
        {/* Add more user details as needed */}
        <Button type="primary" danger className="mt-3" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default Profile;
