import React, { useEffect } from "react";
import { FaUsers, FaBox, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Layout, Card, Row, Col, Button, message } from 'antd';
import Sidebar from "./DashboardSettings";
import { useFormContext } from "../FormContext";
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

  useEffect(() => {
    if (dashboardData.users === 0 && dashboardData.items === 0) {
      fetchDashboardData();
    }
  }, [dashboardData, fetchDashboardData]);

  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Header className="header">Admin Dashboard</Header>
        <Content className="container mt-5 pt-5">
          <Row gutter={[16, 16]} justify="center">
            <StatCard
              title="Manage Users"
              value={<strong>{dashboardData.users}</strong>}
              icon={<FaUsers className="fs-1" />}
              color="#e9ecef"
              iconColor="#007bff"
              onClick={() => navigate("/manageusers")}
            />
            <StatCard
              title="List Items"
              value={<strong>{dashboardData.items}</strong>}
              icon={<FaBox className="fs-1" />}
              color="#e9ecef"
              iconColor="#28a745"
              onClick={() => navigate("/ManageItems")}
            />
            <StatCard
              title="Listed Items"
              value={<strong>{dashboardData.items}</strong>}
              icon={<FaClipboardList className="fs-1" />}
              color="#e9ecef"
              iconColor="#ffc107"
              onClick={() => navigate("/ShowItems")}
            />
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
