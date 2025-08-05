import React, { useEffect, useState } from "react";
import { useFormContext } from "../FormContext";
import { fetchItemss, deleteItem, getBlockedDates } from "../Api/ManageitemsAPI";
import { Layout, Card, Spin, Table, Button, message, Tabs, Modal, Empty, DatePicker } from 'antd';
import { useNavigate } from "react-router-dom";
import "../Adminstyles/DisplayPage.css";
import UpdateForm from "./ManageitemsComponents/UpdateForm";

const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

const DisplayPage = () => {
  const { setFormData, setActiveTab, handleBlockDates, handleUnblockDates } = useFormContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const navigate = useNavigate();

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

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  return (
    <Layout>
      <Header className="header">Listed Items</Header>
      <Content className="container mt-5 pt-5">
        {items.length === 0 ? (
          <Empty description="No items to display" />
        ) : (
          items.map((item) => (
            <Card
              key={item._id}
              title={item.listingName}
              className="item-card"
              extra={
                <>
                  <Button type="primary" onClick={() => handleUpdate(item)}>Update</Button>
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
                              {blockedDates.filter(date => date.propertyId._id === item._id).map((date, index) => (
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
                ]}
              />
            </Card>
          ))
        )}
      </Content>
    </Layout>
  );
};

export default DisplayPage;
