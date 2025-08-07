import React, { useEffect, useState } from "react";
import { FaUsers, FaBox, FaClipboardList, FaEnvelope, FaCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Layout, Card, Row, Col, Button, message } from 'antd';
import Sidebar from "./DashboardSettings";
import { useFormContext } from "../FormContext";
import { fetchUsersStats, fetchItemsStats, fetchReservationsStats, fetchContactsStats } from "../Api/DashboardApi";
import "../Adminstyles/Dashboard.css";

const { Header, Content } = Layout;

const StatCard = ({ title, value, icon, color, iconColor, onClick }) => {
  return (
    <Col xs={24} sm={12} md={8} lg={6} style={{ marginTop: '30px' }}> {/* Added margin-top */}
      <Card
        hoverable
        style={{ backgroundColor: color, cursor: "pointer", height: "15rem" }}
        onClick={onClick}
      >
        <div className="text-center">
          <div className="mb-3" style={{ color: iconColor }}>{icon}</div>
          <h5>{title}</h5>
          <h3 className="font-weight-bold">{value}</h3>
          {/* <Button type="primary" className="mt-3">View Details</Button> */}
          <Button type="primary" className="mt-3">Manage</Button>
        
        </div>
      </Card>
    </Col>
  );
};

const Dashboard = () => {
  const { dashboardData, fetchDashboardData } = useFormContext();
  const navigate = useNavigate();

  // Add local state for reservations and contacts counts
  const [usersCount, setUsersCount] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [reservationsCount, setReservationsCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);

  useEffect(() => {
    // Fetch all counts from API
    const fetchAllStats = async () => {
      try {
        const usersRes = await fetchUsersStats();
        setUsersCount(usersRes.usersCount || 0);
        const itemsRes = await fetchItemsStats();
        setItemsCount(itemsRes.itemsCount || 0);
        const reservationsRes = await fetchReservationsStats();
        setReservationsCount(reservationsRes.reservationsCount || 0);
        const contactsRes = await fetchContactsStats();
        setContactsCount(contactsRes.contactsCount || 0);
      } catch (err) {
        setUsersCount(0);
        setItemsCount(0);
        setReservationsCount(0);
        setContactsCount(0);
      }
    };
    fetchAllStats();
  }, []);

  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Header className="header">Admin Dashboard</Header>
        <Content className="container mt-5 pt-5">
          <Row gutter={[16, 16]} justify="center">
            <StatCard
              title="Manage Users"
              value={<strong>{usersCount}</strong>}
              icon={<FaUsers className="fs-1" />}
              color="#e9ecef"
              iconColor="#007bff"
              onClick={() => navigate("/manageusers")}
            />
            <StatCard
              title="List Items"
              value={<strong>{itemsCount}</strong>}
              icon={<FaBox className="fs-1" />}
              color="#e9ecef"
              iconColor="#28a745"
              onClick={() => navigate("/ManageItems")}
            />
            <StatCard
              title="Listed Items"
              value={<strong>{itemsCount}</strong>}
              icon={<FaClipboardList className="fs-1" />}
              color="#e9ecef"
              iconColor="#ffc107"
              onClick={() => navigate("/ShowItems")}
            />
            <StatCard
              title="Reservations"
              value={<strong>{reservationsCount}</strong>}
              icon={<FaCalendarCheck className="fs-1" />}
              color="#e9ecef"
              iconColor="#17a2b8"
              onClick={() => navigate("/ManageReservations")}
            />
            <StatCard
              title="Contact Messages"
              value={<strong>{contactsCount}</strong>}
              icon={<FaEnvelope className="fs-1" />}
              color="#e9ecef"
              iconColor="#6f42c1"
              onClick={() => navigate("/ManageContacts")}
            />
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};



export default Dashboard;
