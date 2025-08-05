import React, { useState, useEffect } from "react";
import { useFormContext } from "../../FormContext";
import { Form, Row, Col, Button, message, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import BasicInfoForm from "./Basicform";
import AddressForm from "./AddressForm";
import MediaForm from "./MediaForm";
import AmenitiesForm from "./AmenitiesForm";
import PriceForm from "./PriceForm";
import "../../Adminstyles/ReviewForm.css";

const ReviewForm = () => {
  const { formData, submitFormData, setActiveTab, submissionError, submissionMessage } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (submissionMessage) {
      message.success(submissionMessage);
      navigate("/showitems"); // Navigate to showitems page on success
    }
    if (submissionError) {
      message.error(submissionError);
    }
  }, [submissionMessage, submissionError, navigate]);

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    await submitFormData();
    setIsSubmitting(false);
  };

  return (
    <Form layout="vertical" className="review-form full-width" style={{ margin: 0 }}>
      <Row gutter={16}>
        <Col span={24}>
          <h3 className="review-title">Review Your Information</h3>
          
          <Divider orientation="left">Basic Information</Divider>
          <BasicInfoForm readOnly />
          <div className="button-container">
            <Button type="default" onClick={() => setActiveTab("basic")} className="edit-button">
              Edit Basic Info
            </Button>
          </div>
          
          <Divider orientation="left">Address</Divider>
          <AddressForm readOnly />
          <div className="button-container">
            <Button type="default" onClick={() => setActiveTab("address")} className="edit-button">
              Edit Address
            </Button>
          </div>
          
          <Divider orientation="left">Media</Divider>
          <MediaForm readOnly />
          <div className="button-container">
            <Button type="default" onClick={() => setActiveTab("media")} className="edit-button">
              Edit Media
            </Button>
          </div>
          
          <Divider orientation="left">Amenities</Divider>
          <AmenitiesForm readOnly />
          <div className="button-container">
            <Button type="default" onClick={() => setActiveTab("amenities")} className="edit-button">
              Edit Amenities
            </Button>
          </div>
          
          <Divider orientation="left">Price</Divider>
          <PriceForm readOnly />
          <div className="button-container">
            <Button type="default" onClick={() => setActiveTab("price")} className="edit-button">
              Edit Price
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24} className="text-center">
          <Button type="primary" onClick={handleSubmit} disabled={isSubmitting || submissionMessage} className="submit-button">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ReviewForm;
