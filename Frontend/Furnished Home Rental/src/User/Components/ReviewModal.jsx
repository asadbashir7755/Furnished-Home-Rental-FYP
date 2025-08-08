import React from 'react';
import { Modal, Form, Rate, Input, Button } from 'antd';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

const { TextArea } = Input;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .ant-modal-header {
    padding: 24px 24px 12px;
    border-bottom: none;
    background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 100%);
  }
  
  .ant-modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #222;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
  
  .ant-rate-star {
    margin-right: 8px;
  }
`;

const ModalDescription = styled.p`
  color: #666;
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 1.5;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const SubmitButton = styled(Button)`
  background: #1890ff;
  border-color: #1890ff;
  height: 40px;
  padding: 0 20px;
  font-weight: 500;
  
  &:hover {
    background: #40a9ff;
    border-color: #40a9ff;
  }
`;

const CancelButton = styled(Button)`
  height: 40px;
  padding: 0 20px;
  font-weight: 500;
`;

const RatingLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const ReviewLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const StyledTextArea = styled(TextArea)`
  padding: 12px;
  font-size: 15px;
  border-radius: 8px;
  resize: none;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const ReviewModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  form, 
  submitting,
  propertyName
}) => {
  return (
    <StyledModal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaStar style={{ color: "#fadb14", marginRight: "10px" }} />
          <span>Review Your Stay at {propertyName}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      destroyOnClose
    >
      <ModalDescription>
        Your feedback helps other guests make informed decisions and assists the host in improving their service.
      </ModalDescription>
      
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="rating"
          label={<RatingLabel>How would you rate your experience?</RatingLabel>}
          rules={[{ required: true, message: 'Please rate your experience' }]}
        >
          <Rate 
            allowHalf 
            style={{ fontSize: 32 }}
            character={<FaStar />}
          />
        </Form.Item>
        
        <Form.Item
          name="comment"
          label={<ReviewLabel>Tell us about your stay</ReviewLabel>}
          rules={[{ required: true, message: 'Please share your experience' }]}
        >
          <StyledTextArea 
            rows={4} 
            placeholder="What did you like? What could be improved?" 
          />
        </Form.Item>
        
        <FormActions>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="primary" htmlType="submit" loading={submitting}>
            Submit Review
          </SubmitButton>
        </FormActions>
      </Form>
    </StyledModal>
  );
};

export default ReviewModal;
