import React, { useEffect, useState } from "react";
import { useFormContext } from "../FormContext";
import { fetchItemss, deleteItem, getBlockedDates, updateItem } from "../Api/ManageitemsAPI";
import { 
  Layout, Card, Spin, Table, Button, message, Tabs, Modal, 
  Empty, DatePicker, Radio, Menu, Divider, Badge, Tag
} from 'antd';
import { 
  HomeOutlined, StarOutlined, ClockCircleOutlined, 
  ToolOutlined, CheckCircleOutlined, FilterOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from "react-router-dom";
import "../Adminstyles/DisplayPage.css";
import UpdateForm from "./ManageitemsComponents/UpdateForm";

const { Header, Content, Sider } = Layout;
const { RangePicker } = DatePicker;

const DisplayPage = () => {
  const { setFormData, setActiveTab, handleBlockDates, handleUnblockDates } = useFormContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Status definitions with icons and colors
  const statusConfig = {
    available: { icon: <CheckCircleOutlined />, color: '#4caf50', label: 'Available' },
    booked: { icon: <ClockCircleOutlined />, color: '#f44336', label: 'Booked' },
    onmaintenance: { icon: <ToolOutlined />, color: '#ff9800', label: 'On Maintenance' },
    featured: { icon: <StarOutlined />, color: '#2196f3', label: 'Featured' },
    new: { icon: <HomeOutlined />, color: '#9c27b0', label: 'New' },
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItemss();
        console.log("Fetched data:", data);
        setItems(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };

    const loadBlockedDates = async () => {
      try {
        const data = await getBlockedDates();
        console.log("Fetched blocked dates:", data);
        setBlockedDates(data);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      }
    };

    loadItems();
    loadBlockedDates();
  }, []);

  const handleUpdate = (item) => {
    setFormData(item);
    setActiveTab("basic");
    navigate("/update");
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteItem(id);
      if (response.message) {
        message.success(response.message);
        setItems(items.filter(item => item._id !== id));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("An error occurred while deleting the item.");
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: () => handleDelete(id),
    });
  };

  const handleDateSelect = async (propertyId) => {
    if (dates.length !== 2) {
      message.error("Please select both start and end dates.");
      return;
    }

    const [startDate, endDate] = dates;

    try {
      await handleBlockDates(propertyId, startDate, endDate);
      const updatedBlockedDates = await getBlockedDates();
      setBlockedDates(updatedBlockedDates);
    } catch (error) {
      message.error("An error occurred while blocking the dates.");
      console.log("error while blocking date : ", error);
    }
  };

  const handleUnblock = async (propertyId, startDate, endDate) => {
    try {
      await handleUnblockDates(propertyId, startDate, endDate);
      const updatedBlockedDates = await getBlockedDates();
      setBlockedDates(updatedBlockedDates);
    } catch (error) {
      message.error("An error occurred while unblocking the dates.");
      console.log("error while unblocking date : ", error);
    }
  };

  const confirmStatusChange = (propertyId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) {
      return; // No change needed if status is the same
    }
    
    Modal.confirm({
      title: 'Change Property Status',
      content: `Are you sure you want to change the status to "${newStatus}"?`,
      okText: 'Yes, Change Status',
      cancelText: 'Cancel',
      onOk: () => handleStatusChange(propertyId, newStatus),
    });
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      // Update only the status field
      const response = await updateItem(propertyId, { status: newStatus });
      if (response.message) {
        message.success(`Status updated to: ${newStatus}`);
        // Update the local state to reflect the change without a page refresh
        setItems(items.map(item => 
          item._id === propertyId ? { ...item, status: newStatus } : item
        ));
      } else {
        message.error("Failed to update status");
      }
    } catch (error) {
      message.error("An error occurred while updating the status.");
      console.error("Error updating status:", error);
    }
  };

  // Filter items based on selected status
  const filteredItems = selectedStatus 
    ? items.filter(item => (item.status || 'available').toLowerCase() === selectedStatus)
    : items;

  // Group items by status when no filter is selected
  const groupedItems = () => {
    if (selectedStatus) return { [selectedStatus]: filteredItems };
    
    return filteredItems.reduce((groups, item) => {
      const status = (item.status || 'available').toLowerCase();
      if (!groups[status]) groups[status] = [];
      groups[status].push(item);
      return groups;
    }, {});
  };

  // Get status counts for the sidebar
  const getStatusCounts = () => {
    return items.reduce((counts, item) => {
      const status = (item.status || 'available').toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  };

  const statusCounts = getStatusCounts();

  // Handle filter selection
  const handleStatusFilter = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
  };
  
  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        className="status-filter-sidebar"
      >
        <div className="sidebar-header">
          <FilterOutlined /> {!collapsed && "Filter Properties"}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedStatus ? [selectedStatus] : []}
          className="status-menu"
        >
          <Menu.Item key="all" onClick={() => setSelectedStatus(null)}>
            <Badge count={items.length} style={{ backgroundColor: '#1890ff' }} />
            <span>All Properties</span>
          </Menu.Item>
          <Divider style={{ margin: '8px 0' }} />
          
          {Object.keys(statusConfig).map(status => (
            <Menu.Item 
              key={status} 
              onClick={() => handleStatusFilter(status)}
              icon={statusConfig[status].icon}
              className={selectedStatus === status ? 'selected-status' : ''}
            >
              <Badge count={statusCounts[status] || 0} style={{ backgroundColor: statusConfig[status].color }} />
              <span>{statusConfig[status].label}</span>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      
      <Layout>
        <Header className="header">Listed Items</Header>
        <Content className="container mt-5 pt-5">
          {items.length === 0 ? (
            <Empty description="No items to display" />
          ) : (
            Object.entries(groupedItems()).map(([status, statusItems]) => (
              <div key={status} className="status-section-container">
                <div className="status-section-header" style={{ borderLeftColor: statusConfig[status]?.color || '#666' }}>
                  {statusConfig[status]?.icon} 
                  <span>{statusConfig[status]?.label || 'Unknown'} Properties</span>
                  <Badge count={statusItems.length} style={{ backgroundColor: statusConfig[status]?.color || '#666' }} />
                </div>
                
                {statusItems.length === 0 ? (
                  <Empty description={`No ${statusConfig[status]?.label || status} properties`} />
                ) : (
                  statusItems.map((item) => (
                    <Card
                      key={item._id}
                      title={
                        <div className="card-title-container">
                          <span>{item.listingName}</span>
                          <Tag color={statusConfig[(item.status || 'available').toLowerCase()]?.color}>
                            {statusConfig[(item.status || 'available').toLowerCase()]?.label}
                          </Tag>
                        </div>
                      }
                      className="item-card"
                      extra={
                        <>
                          <Button type="primary" onClick={() => handleUpdate(item)}>Update</Button>
                          {(item.status === 'booked' || statusCounts.booked > 0) && (
                            <Link to={`/reservations/${item._id}`}>
                              <Button 
                                type="default" 
                                style={{ marginLeft: '10px' }}
                                icon={<ClockCircleOutlined />}
                              >
                                View Bookings
                              </Button>
                            </Link>
                          )}
                          <Button type="danger" onClick={() => confirmDelete(item._id)} style={{ marginLeft: '10px' }}>Delete</Button>
                        </>
                      }
                    >
                      <Tabs
                        defaultActiveKey="1"
                        items={[
                          {
                            key: "1",
                            label: "Details",
                            children: (
                              <Table
                                dataSource={[item]}
                                columns={[
                                  { title: 'Description', dataIndex: 'description', key: 'description' },
                                  { title: 'Person Capacity', dataIndex: 'personCapacity', key: 'personCapacity' },
                                  { title: 'Property Type', dataIndex: 'propertyType', key: 'propertyType' },
                                  { title: 'Room Type', dataIndex: 'roomType', key: 'roomType' },
                                  { title: 'Number of Bedrooms', dataIndex: 'numBedrooms', key: 'numBedrooms' },
                                  { title: 'Number of Beds', dataIndex: 'numBeds', key: 'numBeds' },
                                  { title: 'Number of Bathrooms', dataIndex: 'numBathrooms', key: 'numBathrooms' },
                                  { title: 'Bathroom Type', dataIndex: 'bathroomType', key: 'bathroomType' },
                                  { title: 'Number of Guest Bathrooms', dataIndex: 'numGuestBathrooms', key: 'numGuestBathrooms' },
                                ]}
                                rowKey={(record) => record._id}
                                pagination={false}
                              />
                            ),
                          },
                          {
                            key: "2",
                            label: "Address",
                            children: (
                              <Table
                                dataSource={[item.address]}
                                columns={[
                                  { title: 'Public Address', dataIndex: 'publicAddress', key: 'publicAddress' },
                                  { title: 'Country', dataIndex: 'country', key: 'country' },
                                  { title: 'State', dataIndex: 'state', key: 'state' },
                                  { title: 'City', dataIndex: 'city', key: 'city' },
                                  { title: 'Street', dataIndex: 'street', key: 'street' },
                                  { title: 'Zip Code', dataIndex: 'zipCode', key: 'zipCode' },
                                ]}
                                rowKey={(record) => record.publicAddress}
                                pagination={false}
                              />
                            ),
                          },
                          {
                            key: "3",
                            label: "Pricing",
                            children: (
                              <Table
                                dataSource={[item.pricing]}
                                columns={[
                                  { title: 'Price per Night', dataIndex: 'pricePerNight', key: 'pricePerNight' },
                                  { title: 'Price per Week', dataIndex: 'pricePerWeek', key: 'pricePerWeek' },
                                  { title: 'Price per Month', dataIndex: 'pricePerMonth', key: 'pricePerMonth' },
                                  { title: 'Weekly Discount', dataIndex: 'weeklyDiscount', key: 'weeklyDiscount' },
                                  { title: 'Monthly Discount', dataIndex: 'monthlyDiscount', key: 'monthlyDiscount' },
                                ]}
                                rowKey={(record) => record.pricePerNight}
                                pagination={false}
                              />
                            ),
                          },
                          {
                            key: "4",
                            label: "Amenities",
                            children: (
                              <Table
                                dataSource={[{ amenities: item.amenities.join(", ") }]}
                                columns={[
                                  { title: 'Amenities', dataIndex: 'amenities', key: 'amenities' },
                                ]}
                                rowKey={(record) => record.amenities}
                                pagination={false}
                              />
                            ),
                          },
                          {
                            key: "5",
                            label: "Media",
                            children: item.mediaFiles.length === 0 ? (
                              <Empty description="No media available" />
                            ) : (
                              <div className="media-container">
                                {item.mediaFiles.map((file, index) => (
                                  <div key={index} className="media-item">
                                    {file.type === 'image' ? (
                                      <img src={file.url} alt={`media-${index}`} className="item-image" />
                                    ) : (
                                      <video src={file.url} controls className="item-video" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            ),
                          },
                          {
                            key: "6",
                            label: "Block Dates",
                            children: (
                              <div className="block-dates-section">
                                <RangePicker
                                  value={dates}
                                  onChange={(dates) => setDates(dates)}
                                  className="date-picker"
                                />
                                <Button type="primary" onClick={() => handleDateSelect(item._id)} style={{ marginTop: '10px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}>Block Dates</Button>
                                {dates.length !== 2 ? (
                                  <p className="no-dates-selected">No dates selected</p>
                                ) : null}
                                {blockedDates.length > 0 && (
                                  <div className="blocked-dates">
                                    <h4>Blocked Dates:</h4>
                                    <ul>
                                      {blockedDates
                                        .filter(date => date.propertyId && date.propertyId._id === item._id)
                                        .map((date, index) => (
                                          <li key={index}>
                                            {new Date(date.startDate).toLocaleDateString()} to {new Date(date.endDate).toLocaleDateString()}
                                            <Button type="link" onClick={() => handleUnblock(item._id, date.startDate, date.endDate)}>Unblock</Button>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ),
                          },
                          {
                            key: "7",
                            label: "Status",
                            children: (
                              <div className="status-section">
                                <h3>Current Status: <span className={`status-badge status-${item.status?.toLowerCase() || 'unknown'}`}>{item.status || 'Not Set'}</span></h3>
                                
                                <div className="status-update-section">
                                  <h4>Update Status:</h4>
                                  <Radio.Group 
                                    value={item.status} 
                                    onChange={(e) => confirmStatusChange(item._id, e.target.value, item.status)}
                                  >
                                    <Radio.Button value="available">Available</Radio.Button>
                                    <Radio.Button value="booked">Booked</Radio.Button>
                                    <Radio.Button value="onmaintenance">On Maintenance</Radio.Button>
                                    <Radio.Button value="featured">Featured</Radio.Button>
                                    <Radio.Button value="new">New</Radio.Button>
                                  </Radio.Group>
                                  <div className="status-help-text" style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                    <p><strong>Available:</strong> Property is ready to be booked</p>
                                    <p><strong>Booked:</strong> Property is currently reserved</p>
                                    <p><strong>On Maintenance:</strong> Property is undergoing repairs or cleaning</p>
                                    <p><strong>Featured:</strong> Property will be highlighted in search results</p>
                                    <p><strong>New:</strong> Property was recently added to the platform</p>
                                  </div>
                                </div>
                              </div>
                            ),
                          }
                        ]}
                      />
                    </Card>
                  ))
                )}
              </div>
            ))
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DisplayPage;
