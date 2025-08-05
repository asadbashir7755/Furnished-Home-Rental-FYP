import React from "react";
import { useFormContext } from "../../FormContext";
import { Form, Input, Select, Row, Col, Button, message } from 'antd';
import "../../Adminstyles/Basicform.css";

const { Option } = Select;

const BasicInfoForm = ({ readOnly = false }) => {
  const { formData, updateFormData, setActiveTab } = useFormContext();

  const handleNext = () => {
    // Validate form fields
    if (!formData.listingName) {
      message.error("Listing Name is required.");
      return;
    }
    if (!formData.externalListingName) {
      message.error("External Listing Name is required.");
      return;
    }
    if (!formData.description) {
      message.error("Description is required.");
      return;
    }
    // if (!formData.listingOwner) {
    //   message.error("Listing Owner is required.");
    //   return;
    // }
    if (!formData.personCapacity) {
      message.error("Person Capacity is required.");
      return;
    }
    if (!formData.propertyType) {
      message.error("Property Type is required.");
      return;
    }
    if (!formData.roomType) {
      message.error("Room Type is required.");
      return;
    }
    if (!formData.numBedrooms) {
      message.error("Number of Bedrooms is required.");
      return;
    }
    if (!formData.numBeds) {
      message.error("Number of Beds is required.");
      return;
    }
    if (!formData.numBathrooms) {
      message.error("Number of Bathrooms is required.");
      return;
    }
    if (!formData.bathroomType) {
      message.error("Bathroom Type is required.");
      return;
    }
    if (!formData.numGuestBathrooms) {
      message.error("Number of Guest Bathrooms is required.");
      return;
    }

    // If validation passes, move to the next tab
    setActiveTab("address"); 
  };

  return (
    <Form layout="vertical" className="basic-info-form full-width" style={{ margin: 0 }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Listing Name" className="form-item">
            <Input
              name="listingName"
              placeholder="Enter Listing Name"
              value={formData.listingName || ""}
              onChange={(e) => updateFormData({ listingName: e.target.value })}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="External Listing Name" className="form-item">
            <Input
              name="externalListingName"
              placeholder="Enter External Listing Name"
              value={formData.externalListingName || ""}
              onChange={(e) => updateFormData({ externalListingName: e.target.value })}
              readOnly={readOnly}
            />
          </Form.Item>
          <Form.Item label="Tags" className="form-item">
            <Select
              mode="tags"
              placeholder="Enter Tags"
              value={formData.tags || []}
              onChange={(value) => updateFormData({ tags: value })}
              disabled={readOnly}
            />
          </Form.Item>
          <Form.Item label="Description" className="form-item">
            <Input.TextArea
              name="description"
              placeholder="Enter Description"
              value={formData.description || ""}
              onChange={(e) => updateFormData({ description: e.target.value })}
              readOnly={readOnly}
              rows={1}
            />
          </Form.Item>
          {/* <Form.Item label="Listing Owner" className="form-item">
            <Select
              placeholder="Select Listing Owner"
              value={formData.listingOwner || ""}
              onChange={(value) => updateFormData({ listingOwner: value })}
              disabled={readOnly}
            >
              <Option value="owner1">Owner 1</Option>
              <Option value="owner2">Owner 2</Option>
            </Select>
          </Form.Item> */}
          <Form.Item label="Person Capacity" className="form-item">
            <Select
              placeholder="Select Person Capacity"
              value={formData.personCapacity || ""}
              onChange={(value) => updateFormData({ personCapacity: value })}
              disabled={readOnly}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Property Type" className="form-item">
            <Select
              placeholder="Select Property Type"
              value={formData.propertyType || ""}
              onChange={(value) => updateFormData({ propertyType: value })}
              disabled={readOnly}
            >
              <Option value="apartment">Apartment</Option>
              <Option value="house">House</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Room Type" className="form-item">
            <Select
              placeholder="Select Room Type"
              value={formData.roomType || ""}
              onChange={(value) => updateFormData({ roomType: value })}
              disabled={readOnly}
            >
              <Option value="single">Single</Option>
              <Option value="double">Double</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Number of Bedrooms" className="form-item">
            <Select
              placeholder="Select Number of Bedrooms"
              value={formData.numBedrooms || ""}
              onChange={(value) => updateFormData({ numBedrooms: value })}
              disabled={readOnly}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Number of Beds" className="form-item">
            <Select
              placeholder="Select Number of Beds"
              value={formData.numBeds || ""}
              onChange={(value) => updateFormData({ numBeds: value })}
              disabled={readOnly}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Number of Bathrooms" className="form-item">
            <Select
              placeholder="Select Number of Bathrooms"
              value={formData.numBathrooms || ""}
              onChange={(value) => updateFormData({ numBathrooms: value })}
              disabled={readOnly}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Bathroom Types" className="form-item">
            <Select
              placeholder="Select Bathroom Type"
              value={formData.bathroomType || ""}
              onChange={(value) => updateFormData({ bathroomType: value })}
              disabled={readOnly}
            >
              <Option value="full">Full</Option>
              <Option value="half">Half</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Number of Guest Bathrooms" className="form-item">
            <Select
              placeholder="Select Number of Guest Bathrooms"
              value={formData.numGuestBathrooms || ""}
              onChange={(value) => updateFormData({ numGuestBathrooms: value })}
              disabled={readOnly}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
            </Select>
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

export default BasicInfoForm;
