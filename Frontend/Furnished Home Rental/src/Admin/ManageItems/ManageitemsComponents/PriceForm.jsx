import React from "react";
import { useFormContext } from "../../FormContext";
import { Form, Input, Row, Col, Button, message } from 'antd';
import "../../Adminstyles/PriceForm.css";

const PriceForm = ({ readOnly = false }) => {
  const { formData, updateFormData, setActiveTab } = useFormContext();

  const handleNext = () => {
    // Validate form fields
    if (!formData.pricePerNight) {
      message.error("Price per Night is required.");
      return;
    }
    if (!formData.pricePerWeek) {
      message.error("Price per Week is required.");
      return;
    }
    if (!formData.pricePerMonth) {
      message.error("Price per Month is required.");
      return;
    }
    if (!formData.weeklyDiscount) {
      message.error("Weekly Discount is required.");
      return;
    }
    if (!formData.monthlyDiscount) {
      message.error("Monthly Discount is required.");
      return;
    }

    // If validation passes, move to the review tab
    setActiveTab("review");
  };

  return (
    <Form layout="vertical" className="price-form full-width" style={{ margin: 0 }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Price per Night" className="form-item">
            <Input
              name="pricePerNight"
              placeholder="Enter Price per Night"
              value={formData.pricePerNight || ""}
              onChange={(e) => updateFormData({ pricePerNight: e.target.value })}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="Price per Week" className="form-item">
            <Input
              name="pricePerWeek"
              placeholder="Enter Price per Week"
              value={formData.pricePerWeek || ""}
              onChange={(e) => updateFormData({ pricePerWeek: e.target.value })}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="Price per Month" className="form-item">
            <Input
              name="pricePerMonth"
              placeholder="Enter Price per Month"
              value={formData.pricePerMonth || ""}
              onChange={(e) => updateFormData({ pricePerMonth: e.target.value })}
              readOnly={readOnly}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Weekly Discount (%)" className="form-item">
            <Input
              name="weeklyDiscount"
              placeholder="Enter Weekly Discount"
              value={formData.weeklyDiscount || ""}
              onChange={(e) => updateFormData({ weeklyDiscount: e.target.value })}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="Monthly Discount (%)" className="form-item">
            <Input
              name="monthlyDiscount"
              placeholder="Enter Monthly Discount"
              value={formData.monthlyDiscount || ""}
              onChange={(e) => updateFormData({ monthlyDiscount: e.target.value })}
              readOnly={readOnly}
            />
          </Form.Item>
        </Col>
      </Row>
      {!readOnly && (
        <Row>
          <Col xs={24} className="text-right">
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default PriceForm;
