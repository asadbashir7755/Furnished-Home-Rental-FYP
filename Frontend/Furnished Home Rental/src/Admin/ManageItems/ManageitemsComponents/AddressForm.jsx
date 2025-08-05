import React from "react";
import { useFormContext } from "../../FormContext";
import { Form, Input, Select, Row, Col, Button, message } from "antd";
import "../../Adminstyles/AddressForm.css";

const { Option } = Select;

const AddressForm = ({ readOnly = false }) => {
  const { formData, updateFormData, setActiveTab } = useFormContext();

  const handleNext = () => {
    // Validate form fields
    if (!formData.address?.publicAddress) {
      message.error("Public Address is required.");
      return;
    }
    if (!formData.address?.country) {
      message.error("Country is required.");
      return;
    }
    if (!formData.address?.state) {
      message.error("State is required.");
      return;
    }
    if (!formData.address?.city) {
      message.error("City is required.");
      return;
    }
    if (!formData.address?.street) {
      message.error("Street is required.");
      return;
    }
    if (!formData.address?.zipCode) {
      message.error("Zip Code / Postcode is required.");
      return;
    }

    // If validation passes, move to the next tab
    setActiveTab("media"); // Replace "nextTab" with the actual next tab name
  };

  const handleAddressChange = (field, value) => {
    updateFormData({
      address: {
        ...formData.address,
        [field]: value,
      },
    });
  };

  return (
    <Form layout="vertical" className="address-form full-width" style={{ margin: 0 }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Public Address" className="form-item">
            <Input
              name="publicAddress"
              placeholder="Enter Public Address"
              value={formData.address?.publicAddress || ""}
              onChange={(e) => handleAddressChange("publicAddress", e.target.value)}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="Country" className="form-item">
            <Select
              placeholder="Select Country"
              value={formData.address?.country || ""}
              onChange={(value) => handleAddressChange("country", value)}
              disabled={readOnly}
            >
              <Option value="Pakistan">Pakistan</Option>
              {/* <Option value="Canada">Canada</Option> */}
            </Select>
          </Form.Item>
          <Form.Item label="State" className="form-item">
            <Input
              name="state"
              placeholder="Enter State"
              value={formData.address?.state || ""}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              readOnly={readOnly}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="City" className="form-item">
            <Input
              name="city"
              placeholder="Enter City"
              value={formData.address?.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="Street" className="form-item">
            <Input
              name="street"
              placeholder="Enter Street"
              value={formData.address?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="Zip Code / Postcode" className="form-item">
            <Input
              name="zipCode"
              placeholder="Enter Zip Code / Postcode"
              value={formData.address?.zipCode || ""}
              onChange={(e) => handleAddressChange("zipCode", e.target.value)}
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

export default AddressForm;
