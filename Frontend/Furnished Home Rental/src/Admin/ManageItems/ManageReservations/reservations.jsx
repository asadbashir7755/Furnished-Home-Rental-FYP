import React, { useEffect, useState, useRef } from "react";
import {
  Layout,
  Card,
  Spin,
  Empty,
  Tag,
  Row,
  Col,
  Typography,
  Alert,
  Divider,
  Tooltip,
  Space,
  message,
  Tabs,
  Select,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getAllReservations, updateReservationStatus } from "../../Api/reservations";
import "../../Adminstyles/DisplayPage.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

function getStatusColor(status) {
  const statusColors = {
    pending: "orange",
    confirmed: "green",
    cancelled: "red",
    completed: "blue",
  };
  return statusColors[status?.toLowerCase()] || "default";
}

function getTimeRemaining(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const statusTabs = [
  { key: "all", label: "All" },
  { key: "current", label: "Current" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "pending", label: "Pending" },
];

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const timerRef = useRef();

  // Fetch all reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllReservations();
        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [refresh]);

  // Timer for current reservations
  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Only set timer if there are current reservations
    if (currentReservations().length > 0) {
      timerRef.current = setInterval(() => {
        setRefresh((r) => !r); // Trigger re-render to update countdown
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [reservations]);

  // Auto-complete current reservations if time is up
  useEffect(() => {
    const checkAndComplete = async () => {
      for (const res of currentReservations()) {
        const endDate =
          res.dates?.endDate ||
          res.checkOutDate ||
          (res.dates && res.dates[1]) ||
          null;
        if (endDate && new Date(endDate) <= new Date() && res.status !== "completed") {
          // Call API to mark as completed
          await updateReservationStatus(res._id, "completed");
          message.success(`Reservation ${res._id} marked as completed.`);
          setRefresh((r) => !r);
        }
      }
    };
    checkAndComplete();
    // eslint-disable-next-line
  }, [reservations]);

  // Categorize reservations
  function currentReservations() {
    const now = new Date();
    return reservations.filter((res) => {
      const start = new Date(res.dates?.startDate || res.checkInDate);
      const end = new Date(res.dates?.endDate || res.checkOutDate);
      return (
        res.status === "confirmed" &&
        start <= now &&
        end > now
      );
    });
  }
  function upcomingReservations() {
    const now = new Date();
    return reservations.filter((res) => {
      const start = new Date(res.dates?.startDate || res.checkInDate);
      return (
        res.status === "confirmed" &&
        start > now
      );
    });
  }
  function completedReservations() {
    return reservations.filter((res) => res.status === "completed");
  }
  function cancelledReservations() {
    return reservations.filter((res) => res.status === "cancelled");
  }
  function pendingReservations() {
    return reservations.filter((res) => res.status === "pending");
  }
  function confirmedReservations() {
    return reservations.filter((res) => res.status === "confirmed");
  }

  function allReservations() {
    return reservations;
  }

  // Card rendering helper
  function renderReservationCard(reservation, showCountdown = false) {
    const endDate =
      reservation.dates?.endDate ||
      reservation.checkOutDate ||
      (reservation.dates && reservation.dates[1]) ||
      null;
    const startDate =
      reservation.dates?.startDate ||
      reservation.checkInDate ||
      (reservation.dates && reservation.dates[0]) ||
      null;
    // Show remaining time from booking (startDate) to completion (endDate)
    const now = new Date();
    let totalDuration = null;
    let elapsed = null;
    let percent = null;
    let remaining = null;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      totalDuration = end - start;
      elapsed = now - start;
      percent = Math.max(0, Math.min(100, Math.floor((elapsed / totalDuration) * 100)));
      const diff = end - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        remaining = { days, hours, minutes, seconds };
      } else {
        remaining = null;
      }
    }

    // Remove status change select: status is now only displayed, not editable
    return (
      <Card
        key={reservation._id}
        className="reservation-card"
        style={{
          borderRadius: 10,
          boxShadow: "0 2px 12px #00000014",
          background: "#fff",
          border: "1px solid #f0f0f0",
          marginTop: 0,
        }}
        title={
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <Tag
                  color={getStatusColor(reservation.status)}
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: 1,
                    padding: "3px 14px",
                  }}
                >
                  {reservation.status?.toUpperCase() || "UNKNOWN"}
                </Tag>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  #{reservation.paymentIntentId?.substring(3, 9) ||
                    reservation._id?.substring(0, 6) ||
                    "Unknown"}
                </Text>
              </Space>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: 14 }}>
                <InfoCircleOutlined /> Created:{" "}
                {reservation.createdAt
                  ? new Date(reservation.createdAt).toLocaleString()
                  : "N/A"}
              </Text>
            </Col>
          </Row>
        }
        extra={
          <Tooltip title="Reservation ID">
            <Text code copyable style={{ fontSize: 13 }}>
              {reservation._id}
            </Text>
          </Tooltip>
        }
        bodyStyle={{ padding: 28, background: "#fff" }}
      >
        <Row gutter={[32, 24]}>
          {/* Property Info */}
          <Col xs={24} md={8}>
            <Title level={5} style={{ marginBottom: 8, color: "#1677ff" }}>
              <HomeOutlined /> Property Details
            </Title>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Name:</Text>{" "}
              <Text>{reservation.propertyId?.listingName || "N/A"}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Address:</Text>{" "}
              <Text>{reservation.propertyId?.address?.publicAddress || "N/A"}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Price/Night:</Text>{" "}
              <DollarOutlined />{" "}
              <Text>
                {reservation.propertyId?.pricing?.pricePerNight
                  ? `$${reservation.propertyId.pricing.pricePerNight}`
                  : "N/A"}
              </Text>
            </div>
          </Col>
          {/* Guest Info */}
          <Col xs={24} md={8}>
            <Title level={5} style={{ marginBottom: 8, color: "#1677ff" }}>
              <UserOutlined /> Guest Information
            </Title>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Name:</Text>{" "}
              <Text>{reservation.user?.name || "Guest"}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>
                <MailOutlined /> Email:
              </Text>{" "}
              <a href={`mailto:${reservation.user?.email}`}>
                {reservation.user?.email || "N/A"}
              </a>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>
                <PhoneOutlined /> Phone:
              </Text>{" "}
              <Text>{reservation.user?.phone || "N/A"}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Guests:</Text>{" "}
              <Text>{reservation.guests || 1}</Text>
            </div>
          </Col>
          {/* Reservation Info */}
          <Col xs={24} md={8}>
            <Title level={5} style={{ marginBottom: 8, color: "#1677ff" }}>
              <CalendarOutlined /> Reservation Info
            </Title>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Check-in:</Text>{" "}
              <Text>
                {startDate
                  ? new Date(startDate).toLocaleDateString()
                  : "N/A"}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 13 }}>
                {startDate
                  ? new Date(startDate).toLocaleTimeString()
                  : ""}
              </Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Check-out:</Text>{" "}
              <Text>
                {endDate
                  ? new Date(endDate).toLocaleDateString()
                  : "N/A"}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 13 }}>
                {endDate
                  ? new Date(endDate).toLocaleTimeString()
                  : ""}
              </Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Total Amount:</Text>{" "}
              <DollarOutlined /> <Text>{reservation.totalAmount || 0}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Payment Status:</Text>{" "}
              <Text>
                {reservation.paymentStatus ||
                  (reservation.paymentIntentId ? "Paid" : "Pending")}
              </Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Payment Method:</Text>{" "}
              <Text>{reservation.paymentMethod || "Not specified"}</Text>
            </div>
            {/* Show remaining time from booking until completion */}
            {showCountdown && startDate && endDate && (() => {
              // Live countdown timer
              const [countdown, setCountdown] = React.useState(() => {
                const diff = new Date(endDate) - new Date();
                return diff > 0 ? diff : 0;
              });
              React.useEffect(() => {
                const interval = setInterval(() => {
                  const diff = new Date(endDate) - new Date();
                  setCountdown(diff > 0 ? diff : 0);
                }, 1000);
                return () => clearInterval(interval);
              }, [endDate]);
              let remaining = null;
              if (countdown > 0) {
                const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
                const hours = Math.floor((countdown / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((countdown / (1000 * 60)) % 60);
                const seconds = Math.floor((countdown / 1000) % 60);
                remaining = { days, hours, minutes, seconds };
              }
              // Progress
              const now = new Date();
              const start = new Date(startDate);
              const end = new Date(endDate);
              const totalDuration = end - start;
              const elapsed = now - start;
              const percent = Math.max(0, Math.min(100, Math.floor((elapsed / totalDuration) * 100)));
              return (
                <div style={{ marginTop: 12 }}>
                  {remaining ? (
                    <Tag icon={<ClockCircleOutlined />} color="processing" style={{ fontSize: 15 }}>
                      Remaining: {remaining.days}d {String(remaining.hours).padStart(2, "0")}h {String(remaining.minutes).padStart(2, "0")}m {String(remaining.seconds).padStart(2, "0")}s
                    </Tag>
                  ) : (
                    <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: 15 }}>
                      Completed
                    </Tag>
                  )}
                  <div style={{ marginTop: 4, fontSize: 13, color: "#888" }}>
                    Progress: {percent}% complete
                  </div>
                </div>
              );
            })()}
          </Col>
        </Row>
        {reservation.specialRequests && (
          <>
            <Divider />
            <Row>
              <Col span={24}>
                <Title level={5} style={{ color: "#1677ff" }}>
                  <InfoCircleOutlined /> Special Requests
                </Title>
                <Text>{reservation.specialRequests}</Text>
              </Col>
            </Row>
          </>
        )}
      </Card>
    );
  }

  // Tab content logic
  function getTabData(tabKey) {
    switch (tabKey) {
      case "pending":
        return pendingReservations();
      case "confirmed":
        return confirmedReservations();
      case "current":
        return currentReservations();
      case "completed":
        return completedReservations();
      case "cancelled":
        return cancelledReservations();
      default:
        return allReservations();
    }
  }

  if (loading) {
    return (
      <div className="reservation-loading" style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 18, fontSize: 18, color: "#555" }}>Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: 32 }}
      />
    );
  }

  return (
    <Layout>
      <Header
        className="header"
        style={{
          fontSize: 24,
          fontWeight: 600,
          background: "#1677ff",
          color: "#fff",
          boxShadow: "0 2px 8px #0000000a",
          padding: "0 40px",
          marginBottom: 0,
          lineHeight: "64px",
        }}
      >
        <CalendarOutlined style={{ marginRight: 12 }} />
        All Reservations
      </Header>
      <Content
        className="container"
        style={{
          maxWidth: 1200,
          margin: "70px auto 0 auto",
          padding: "0 24px 40px 24px",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          style={{ marginBottom: 32 }}
        >
          {statusTabs.map((tab) => (
            <TabPane tab={tab.label} key={tab.key}>
              {getTabData(tab.key).length === 0 ? (
                <Empty
                  description={<Text style={{ fontSize: 16, color: "#888" }}>No reservations</Text>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ margin: "32px 0" }}
                />
              ) : (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                  {getTabData(tab.key).map((res) =>
                    tab.key === "current"
                      ? renderReservationCard(res, true)
                      : renderReservationCard(res)
                  )}
                </Space>
              )}
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  );
};



export default ReservationsPage;
