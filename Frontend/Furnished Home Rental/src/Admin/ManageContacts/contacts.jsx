import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Spin,
  Alert,
  Tabs,
  Tag,
  Button,
  message,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Tooltip,
  Badge,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { getAllContacts, updateContactStatus } from "../Api/contact";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const statusTabs = [
  { key: "new", label: "New" },
  { key: "responded", label: "Responded" },
  { key: "all", label: "All" },
];

const statusColors = {
  new: "processing",
  responded: "success",
};

const statusIcons = {
  new: <ClockCircleOutlined />,
  responded: <CheckCircleOutlined />,
};

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("new");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await getAllContacts();
        if (Array.isArray(data)) {
          setContacts(data);
        } else if (Array.isArray(data.contacts)) {
          setContacts(data.contacts);
        } else {
          setContacts([]);
        }
      } catch (err) {
        setError("Failed to load contact messages");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleStatusChange = async (contactId, newStatus) => {
    setUpdatingId(contactId);
    try {
      await updateContactStatus(contactId, newStatus);
      setContacts((prev) =>
        prev.map((c) =>
          c._id === contactId ? { ...c, status: newStatus } : c
        )
      );
      message.success("Status updated successfully");
    } catch (err) {
      message.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getTabData = (tabKey) => {
    if (tabKey === "all") return contacts;
    return contacts.filter((c) => (c.status || "new").toLowerCase() === tabKey);
  };

  const renderStatusTag = (status) => {
    const key = (status || "new").toLowerCase();
    return (
      <Tag
        icon={statusIcons[key]}
        color={statusColors[key]}
        style={{ fontSize: 15, fontWeight: 500, letterSpacing: 1, marginRight: 0 }}
      >
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </Tag>
    );
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 18, fontSize: 18, color: "#555" }}>Loading contact messages...</p>
      </div>
    );
  if (error)
    return (
      <Alert message={error} type="error" style={{ margin: 32 }} />
    );

  return (
    <Card
      title={
        <Row align="middle" style={{ marginBottom: 0 }}>
          <Col>
            <Title level={3} style={{ margin: 0, color: "#1677ff", display: "flex", alignItems: "center" }}>
              <MessageOutlined style={{ marginRight: 10 }} />
              Contact Messages
            </Title>
          </Col>
        </Row>
      }
      style={{
        maxWidth: 900,
        margin: "40px auto",
        borderRadius: 16,
        boxShadow: "0 6px 32px #00000010",
        background: "#fff",
        border: "1px solid #e6e6e6",
        padding: 0,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ margin: "0 0 24px 0" }}
        tabBarExtraContent={
          <div style={{ marginLeft: 32 }}>
            <Space>
              <Badge
                count={getTabData("responded").length}
                style={{ backgroundColor: "#52c41a", marginRight: 24, zIndex: 1 }}
                offset={[0, 0]}
                title="Responded"
              >
                <span style={{ color: "#555", fontWeight: 500, marginRight: 24 }}>Responded</span>
              </Badge>
              <Badge
                count={getTabData("new").length}
                style={{ backgroundColor: "#faad14", zIndex: 0 }}
                offset={[0, 0]}
                title="New"
              >
                <span style={{ color: "#555", fontWeight: 500, marginLeft: 8 }}>New</span>
              </Badge>
            </Space>
          </div>
        }
      >
        {statusTabs.map((tab) => (
          <TabPane tab={tab.label} key={tab.key}>
            <List
              dataSource={getTabData(tab.key)}
              locale={{ emptyText: <Text type="secondary">No contacts found</Text> }}
              renderItem={item => (
                <List.Item
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: "#f9fafb",
                    borderRadius: 12,
                    margin: "18px 0",
                    padding: "28px 18px",
                  }}
                  actions={[
                    renderStatusTag(item.status),
                    (item.status || "new").toLowerCase() === "new" && (
                      <Button
                        type="primary"
                        size="small"
                        loading={updatingId === item._id}
                        onClick={() => handleStatusChange(item._id, "responded")}
                        style={{ minWidth: 140, fontWeight: 500 }}
                      >
                        Mark as Responded
                      </Button>
                    ),
                  ]}
                >
                  <Row style={{ width: "100%" }} gutter={16}>
                    <Col xs={24} md={18}>
                      <Space direction="vertical" size={2} style={{ width: "100%" }}>
                        <Text strong style={{ fontSize: 18, color: "#222" }}>
                          <UserOutlined style={{ color: "#1677ff", marginRight: 6 }} />
                          {item.firstName || ""} {item.lastName || ""}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 15 }}>
                          <MailOutlined /> {item.email}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 15 }}>
                          <PhoneOutlined /> {item.phone}
                        </Text>
                        <Divider style={{ margin: "10px 0" }} />
                        <Text style={{ fontSize: 16 }}>
                          <b>Message:</b> {item.message}
                        </Text>
                      </Space>
                    </Col>
                    <Col xs={24} md={6} style={{ textAlign: "right" }}>
                      <Tooltip title="Received at">
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          <CalendarOutlined />{" "}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : ""}
                        </Text>
                      </Tooltip>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

export default ContactsPage;
