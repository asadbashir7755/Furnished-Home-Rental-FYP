import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Carousel, Row, Col, Card, Typography, List, Modal, Divider, Calendar, Rate, Button, Avatar, Space } from "antd";
import { FaWifi, FaSwimmer, FaParking, FaDumbbell, FaTv, FaAirFreshener, FaPaw, FaMountain, FaUtensils } from "react-icons/fa";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const amenitiesIcons = {
  "WiFi": <FaWifi />,
  "Swimming Pool": <FaSwimmer />,
  "Parking": <FaParking />,
  "Gym": <FaDumbbell />,
  "TV": <FaTv />,
  "Air Conditioning": <FaAirFreshener />,
  "Pets allowed": <FaPaw />,
  "Mountain view": <FaMountain />,
  "Kitchen": <FaUtensils />,
};

const PropertyDetails = () => {
  const { state } = useLocation();
  const property = state?.property;

  if (!property) {
    return <div>Property details not available.</div>;
  }

  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setVisible(true);
  };

  const onSelectDate = (date) => {
    if (!checkInDate) {
      setCheckInDate(date);
    } else if (!checkOutDate) {
      setCheckOutDate(date);
    } else {
      setCheckInDate(date);
      setCheckOutDate(null);
    }
  };

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const basePrice = nights * property.pricing.pricePerNight;
    const cleaningFee = 59;
    const serviceFee = 112; 
    return basePrice + cleaningFee + serviceFee;
  };

  return (
    <div className="container my-5">
      <Title level={2} className="mb-4">{property.listingName}</Title>
      <Text className="d-block mb-3">
        {property.address.city}, {property.address.state}, {property.address.country}
      </Text>
      <Text className="d-block mb-3">
        {property.personCapacity} guests · {property.numBedrooms} bedrooms · {property.numBathrooms} baths
      </Text>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Carousel autoplay>
            {property.mediaFiles.map((file, index) => (
              <div key={index}>
                <img src={file.url} alt={`Property image ${index + 1}`} style={styles.image} onClick={() => handleImageClick(file.url)} />
              </div>
            ))}
          </Carousel>
          <div className="image-gallery mt-4">
            {property.mediaFiles.map((file, index) => (
              <img key={index} src={file.url} alt={`Property image ${index + 1}`} style={styles.thumbnail} onClick={() => handleImageClick(file.url)} />
            ))}
          </div>
        </Col>
        <Col xs={24} md={8}>
          <Card style={styles.bookingCard}>
            <Title level={4}>${property.pricing.pricePerNight} / night</Title>
            <div style={styles.datePicker}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text strong>Check-in</Text>
                <Text>{checkInDate ? checkInDate.format("MMM D, YYYY") : "Select date"}</Text>
                <Text strong>Check-out</Text>
                <Text>{checkOutDate ? checkOutDate.format("MMM D, YYYY") : "Select date"}</Text>
              </Space>
            </div>
            <Button type="primary" block style={styles.reserveButton}>
              Reserve
            </Button>
            <Text style={{ display: "block", textAlign: "center", marginTop: "10px" }}>
              You won't be charged yet
            </Text>
            <Divider />
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space justify="space-between" style={{ width: "100%" }}>
                <Text>${property.pricing.pricePerNight} x {checkInDate && checkOutDate ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) : 0} nights</Text>
                <Text>${checkInDate && checkOutDate ? property.pricing.pricePerNight * Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) : 0}</Text>
              </Space>
              <Space justify="space-between" style={{ width: "100%" }}>
                <Text>Cleaning fee</Text>
                <Text>$59</Text>
              </Space>
              <Space justify="space-between" style={{ width: "100%" }}>
                <Text>Airbnb service fee</Text>
                <Text>$112</Text>
              </Space>
              <Divider />
              <Space justify="space-between" style={{ width: "100%" }}>
                <Text strong>Total before taxes</Text>
                <Text strong>${calculateTotalPrice()}</Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />
      <Title level={3}>About this space</Title>
      <Text>{property.description}</Text>

      <Divider />
      <Title level={3}>Where you'll sleep</Title>
      <Row gutter={[16, 16]}>
        {Array.from({ length: property.numBedrooms }, (_, i) => (
          <Col xs={24} sm={12} md={8} key={i}>
            <Card title={`Bedroom ${i + 1}`}>
              <Text>1 double bed</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />
      <Title level={3}>What this place offers</Title>
      <List
        dataSource={property.amenities}
        renderItem={(item) => (
          <List.Item>
            {amenitiesIcons[item.trim()] || <FaAirFreshener />} <Text style={styles.amenityText}>{item}</Text>
          </List.Item>
        )}
        grid={{ gutter: 16, column: 1, xs: 1, sm: 2, md: 3 }}
      />

      <Divider />
      <Title level={3}>Select check-in date</Title>
      <Text>5 nights in {property.address.city}</Text>
      <Calendar onSelect={onSelectDate} fullscreen={false} style={{ marginTop: "20px" }} />

      <Divider />
      <Title level={3}>
        <Rate disabled defaultValue={4.85} style={{ marginRight: "10px" }} /> 4.85 · 27 reviews
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Cleanliness</Text>
            <Rate disabled defaultValue={4.8} />
            <Text strong>Accuracy</Text>
            <Rate disabled defaultValue={4.9} />
            <Text strong>Check-in</Text>
            <Rate disabled defaultValue={4.9} />
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Communication</Text>
            <Rate disabled defaultValue={5.0} />
            <Text strong>Location</Text>
            <Rate disabled defaultValue={4.8} />
            <Text strong>Value</Text>
            <Rate disabled defaultValue={4.6} />
          </Space>
        </Col>
      </Row>

      <Divider />
      <Row gutter={[16, 16]}>
        {property.reviews?.slice(0, 4).map((review, index) => (
          <Col xs={24} sm={12} key={index}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Text strong>{review.reviewerName}</Text>
                  <br />
                  <Text>{review.date}</Text>
                </div>
              </Space>
              <Text>{review.comment}</Text>
            </Space>
          </Col>
        ))}
      </Row>
      <Button style={{ marginTop: "20px" }}>Show all 27 reviews</Button>

      <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
        <img alt="Selected" style={{ width: "100%" }} src={selectedImage} />
      </Modal>
    </div>
  );
};

const styles = {
  image: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    cursor: "pointer",
  },
  thumbnail: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    margin: "5px",
    cursor: "pointer",
  },
  amenityText: {
    marginLeft: "10px",
  },
  bookingCard: {
    position: "sticky",
    top: "20px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  datePicker: {
    border: "1px solid #d9d9d9",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  reserveButton: {
    backgroundColor: "#ff385c",
    borderColor: "#ff385c",
  },
};

export default PropertyDetails;