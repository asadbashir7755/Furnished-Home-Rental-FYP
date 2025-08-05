import React from "react";
import { useFormContext } from "../../FormContext";
import { Form, Checkbox, Row, Col, Button, message } from 'antd';
import "../../Adminstyles/AmenitiesForm.css";

const commonAmenities = [
  "Wifi", "Air conditioning", "Balcony", "Washer", "Dryer", "Fridge", 
  "Fireplace", "Pool", "Gym", "Parking", "Heating", "TV", "Dishwasher", 
  "Microwave", "Oven", "Stove", "Coffee Maker", "Toaster", "Blender", 
  "Iron", "Hair Dryer", "Smoke Detector", "Carbon Monoxide Detector", 
  "First Aid Kit", "Fire Extinguisher"
];

const additionalAmenities = [
  "Hot Tub", "Sauna", "BBQ Grill", "Patio", "Garden", "Workspace", 
  "Elevator", "Wheelchair Accessible", "Pet Friendly", "Security System"
];

const AmenitiesForm = ({ readOnly = false }) => {
  const { formData, updateFormData, setActiveTab } = useFormContext();

  const handleCheckboxChange = (checkedValues) => {
    updateFormData({ amenities: checkedValues });
  };

  const handleNext = () => {
    // Validate form fields
    if (!formData.amenities || formData.amenities.length === 0) {
      message.error("At least one amenity must be selected.");
      return;
    }

    // If validation passes, move to the next tab
    setActiveTab("price"); // Replace "nextTab" with the actual next tab name
  };

  return (
    <Form layout="vertical" className="amenities-form full-width" style={{ margin: 0 }}>
      <Row gutter={16}>
        <Col span={24}>
          <h3 className="amenities-title">Common Amenities</h3>
          <Checkbox.Group
            options={commonAmenities}
            value={formData.amenities || []}
            onChange={handleCheckboxChange}
            className="amenities-checkbox-group"
            disabled={readOnly}
          />
          <h3 className="amenities-title">Additional Amenities</h3>
          <Checkbox.Group
            options={additionalAmenities}
            value={formData.amenities || []}
            onChange={handleCheckboxChange}
            className="amenities-checkbox-group"
            disabled={readOnly}
          />
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

export default AmenitiesForm;
