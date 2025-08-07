import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Button, Modal, Avatar, Spin, Form, Input, Tooltip, Divider } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, CheckCircleTwoTone, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getUserProfile, logoutUser, updateUserProfile } from './API/userprofile';
import '../../Styles/ProfilePage.css';

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [form] = Form.useForm();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const data = await getUserProfile();
      console.log("Raw response from backend:", data);
      let userProfileArr = [];
      if (Array.isArray(data)) {
        // unlikely, but handle array of objects with .user property
        userProfileArr = data.map(d => d.user || d);
      } else if (data && data.user) {
        userProfileArr = [data.user];
      } else {
        userProfileArr = [data];
      }
      setProfiles(userProfileArr);
      userProfileArr.forEach((profile, idx) => {
        console.log(`Profile[${idx}]:`, profile);
      });
      setUser(userProfileArr[0]);
      console.log("Profile data fetched successfully:", userProfileArr);
    } catch (error) {
      toast.error("Failed to load profile", { position: "top-right", autoClose: 4000, transition: Slide });
    } finally {
      setProfileLoading(false);
    }
  };

  // Show custom logout modal
  const showLogoutModal = () => {
    setSettingsOpen(false);
    setLogoutOpen(true);
  };

  // Confirm actual logout
  const confirmLogout = async () => {
    setLogoutOpen(false);
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logout successful!", { position: "top-right", autoClose: 4000, transition: Slide });
      navigate("/login");
    } catch (error) {
      toast.error("Error during logout!", { position: "top-right", autoClose: 4000, transition: Slide });
    }
  };

  // Only display these fields
  const displayFields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "country", label: "Country" },
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Joined" }
  ];

  // Handler for edit profile form submit
  const handleEditProfile = () => {
    form.setFieldsValue(profiles[0]);
    setEditing(true);
  };

  const handleEditSubmit = async (values) => {
    setEditFormLoading(true);
    try {
      const updated = await updateUserProfile(values);
      // Update local state
      setProfiles([updated]);
      setUser(updated);
      toast.success("Profile updated!", { position: "top-right", autoClose: 4000, transition: Slide });
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile!", { position: "top-right", autoClose: 4000, transition: Slide });
    } finally {
      setEditFormLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f6f8fa 60%, #e3e8ee 100%)"
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 80,
        background: "linear-gradient(135deg, #f6f8fa 60%, #e3e8ee 100%)",
        minHeight: "100vh"
      }}>
        <Card style={{
          padding: "32px 48px",
          borderRadius: 16,
          boxShadow: "0 4px 24px #e3e8ee",
          textAlign: "center"
        }}>
          <p style={{ fontSize: 18, color: "#888" }}>No profile data found.</p>
          <Button type="primary" onClick={fetchProfile} style={{ marginTop: 16 }}>
            Reload
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#eceff4",
      display: "flex",
      justifyContent: "center"
    }}>
      {/* Sidebar */}
      <div style={{
        width: 320,
        background: "#fff",
        boxShadow: "0 8px 32px #e3e8ee",
        borderRadius: "0 32px 32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "54px 0 32px 0",
        position: "relative",
        minHeight: "100vh"
      }}>
        <div style={{ position: "relative", marginBottom: 28 }}>
          <Avatar
            size={110}
            src={profiles[0]?.avatarUrl || undefined}
            icon={<UserOutlined />}
            style={{
              border: "4px solid #e3e8ee",
              background: "#f6f8fa"
            }}
          />
          {profiles[0]?.isVerified && (
            <Tooltip title="Verified">
              <CheckCircleTwoTone
                twoToneColor="#1890ff"
                style={{
                  position: "absolute",
                  right: -14,
                  bottom: -14,
                  fontSize: 36,
                  background: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px #e3e8ee"
                }}
              />
            </Tooltip>
          )}
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 8,
          color: "#222"
        }}>
          {profiles[0]?.name || "User"}
        </div>
        <div style={{
          color: "#888",
          fontSize: 18,
          marginBottom: 20
        }}>
          {profiles[0]?.email}
        </div>
        <Divider style={{ margin: "20px 0", borderColor: "#e3e8ee" }} />
        <Button
          type="primary"
          icon={<EditOutlined />}
          style={{
            width: "80%",
            marginBottom: 14,
            fontWeight: 600,
            background: "#1890ff",
            border: "none",
            boxShadow: "0 2px 8px #e3e8ee",
            height: 48,
            fontSize: 18,
            borderRadius: 10
          }}
          onClick={handleEditProfile}
          disabled={editing}
        >
          Edit Profile
        </Button>
        {/* Settings button at sidebar bottom */}
        <div style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          <Button
            type="default"
            icon={<SettingOutlined />}
            style={{
              width: "80%",
              fontWeight: 600,
              background: "#fff",
              border: "1px solid #e3e8ee",
              height: 48,
              fontSize: 18,
              borderRadius: 10
            }}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "64px 32px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          {profiles.map((profile, idx) => (
            <Card
              key={profile.id || idx}
              style={{
                width: "100%",
                boxShadow: "0 8px 32px #e3e8ee",
                borderRadius: 24,
                border: "none",
                marginBottom: 40,
                minHeight: 360,
                background: "#fff",
                padding: 0,
                overflow: "hidden"
              }}
              bodyStyle={{ padding: 0 }}
            >
              {/* Card Header with Avatar and Name */}
              <div style={{
                display: "flex",
                alignItems: "center",
                padding: "36px 36px 14px 36px",
                background: "#f7f9fb",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderBottom: "1px solid #e3e8ee"
              }}>
                <div style={{ position: "relative", marginRight: 28 }}>
                  <Avatar
                    size={90}
                    src={profile.avatarUrl || undefined}
                    icon={<UserOutlined />}
                    style={{
                      border: "3px solid #e3e8ee",
                      background: "#fff"
                    }}
                  />
                  {profile.isVerified && (
                    <Tooltip title="Verified">
                      <CheckCircleTwoTone
                        twoToneColor="#1890ff"
                        style={{
                          position: "absolute",
                          right: -10,
                          bottom: -10,
                          fontSize: 28,
                          background: "#fff",
                          borderRadius: "50%",
                          boxShadow: "0 1px 4px #e3e8ee"
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
                <div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 24,
                    color: "#222",
                    marginBottom: 3,
                    letterSpacing: "0.5px"
                  }}>
                    {profile.name || "User"}
                  </div>
                  <div style={{
                    color: "#888",
                    fontSize: 16,
                    fontWeight: 500
                  }}>
                    {profile.email}
                  </div>
                </div>
              </div>
              {/* Card Body with Details */}
              <div style={{
                padding: "36px",
                background: "#fff",
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px"
                }}>
                  {displayFields.map(field => (
                    profile[field.key] ? (
                      <div key={field.key} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "24px",
                        padding: "10px 0",
                        borderBottom: "1px solid #f0f0f0"
                      }}>
                        <span style={{
                          fontWeight: 600,
                          color: "#1890ff",
                          minWidth: 130,
                          fontSize: 17,
                          textAlign: "left"
                        }}>
                          {field.label}:
                        </span>
                        <span style={{
                          color: "#222",
                          background: "#f7f9fb",
                          borderRadius: 8,
                          padding: "8px 18px",
                          fontWeight: 500,
                          fontSize: 17,
                          flex: 1,
                          wordBreak: "break-word"
                        }}>
                          {field.key === "createdAt"
                            ? new Date(profile.createdAt).toLocaleDateString()
                            : profile[field.key]}
                        </span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* Edit Profile Form Modal */}
        <Modal
          title={<span style={{ fontWeight: 700, fontSize: 22, color: "#1890ff" }}>Edit Profile</span>}
          open={editing}
          onCancel={() => setEditing(false)}
          footer={null}
          destroyOnClose
          centered
          bodyStyle={{ padding: "32px 24px" }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditSubmit}
            style={{ marginTop: 8 }}
          >
            {displayFields.filter(f => f.key !== "createdAt" && f.key !== "role").map(field => (
              <Form.Item
                key={field.key}
                label={<span style={{ fontWeight: 500 }}>{field.label}</span>}
                name={field.key}
                rules={[
                  { required: true, message: `Please enter your ${field.label.toLowerCase()}` }
                ]}
              >
                <Input
                  disabled={field.key === "username"}
                  size="large"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e3e8ee",
                    background: "#f7f9fb"
                  }}
                />
              </Form.Item>
            ))}
            <Form.Item style={{ marginTop: 22 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={editFormLoading}
                style={{
                  width: "100%",
                  fontWeight: 600,
                  background: "#1890ff",
                  border: "none",
                  borderRadius: 8,
                  height: 46,
                  fontSize: 17
                }}
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setEditing(false)}
                style={{
                  width: "100%",
                  marginTop: 10,
                  fontWeight: 500,
                  borderRadius: 8,
                  border: "1px solid #e3e8ee",
                  height: 46,
                  fontSize: 17
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* Settings Modal with Logout button */}
        <Modal
          title={<span style={{ fontWeight: 700, fontSize: 22, color: "#1890ff" }}>Settings</span>}
          open={settingsOpen}
          onCancel={() => setSettingsOpen(false)}
          footer={null}
          centered
        >
          <Button
            type="default"
            icon={<LogoutOutlined />}
            style={{
              width: "100%",
              fontWeight: 600,
              background: "#fff",
              border: "1px solid #e3e8ee",
              marginTop: 18,
              height: 48,
              fontSize: 18,
              borderRadius: 8
            }}
            onClick={showLogoutModal}
          >
            Logout
          </Button>
        </Modal>
        {/* Logout confirmation modal */}
        <Modal
          open={logoutOpen}
          footer={null}
          centered
          onCancel={() => setLogoutOpen(false)}
          title={<span style={{ fontWeight: 700, fontSize: 22, color: "#1890ff" }}><ExclamationCircleOutlined style={{ marginRight: 10, color: "#faad14" }} />Confirm Logout</span>}
        >
          <div style={{ fontSize: 17, marginBottom: 28, color: "#444" }}>
            Are you sure you want to logout?
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Button
              type="primary"
              danger
              style={{
                fontWeight: 600,
                width: "50%",
                height: 44,
                fontSize: 16,
                borderRadius: 8
              }}
              onClick={confirmLogout}
            >
              Logout
            </Button>
            <Button
              style={{
                fontWeight: 500,
                width: "50%",
                height: 44,
                fontSize: 16,
                borderRadius: 8,
                border: "1px solid #e3e8ee"
              }}
              onClick={() => setLogoutOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Profile;
