import React from "react";
import { useFormContext } from "../../FormContext";
import { Form, Upload, message, Row, Col, Typography, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "../../Adminstyles/MediaForm.css";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const MediaForm = ({ readOnly = false }) => {
  const { formData, updateFormData, setActiveTab } = useFormContext();

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: "image/png, image/jpeg, image/jpg, video/mp4",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type === "video/mp4";
      const isValid = isImage || isVideo;

      if (!isValid) {
        message.error("Only JPG, PNG images or MP4 videos are allowed.");
        return Upload.LIST_IGNORE;
      }

      if (isImage && file.size > 5 * 1024 * 1024) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      if (isVideo && file.size > 50 * 1024 * 1024) {
        message.error("Video must be smaller than 50MB!");
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    onChange(info) {
      const uniqueFiles = [];
      const fileNames = new Set();
      info.fileList.forEach((file) => {
        if (!fileNames.has(file.name)) {
          uniqueFiles.push(file);
          fileNames.add(file.name);
        }
      });
      updateFormData({ mediaFiles: uniqueFiles });
    },
    customRequest({ onSuccess }) {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
  };

  const handleNext = () => {
    // Validate form fields
    if (!formData.mediaFiles || formData.mediaFiles.length === 0) {
      message.error("At least one media file is required.");
      return;
    }

    // If validation passes, move to the next tab
    setActiveTab("amenities"); // Replace "nextTab" with the actual next tab name
  };

  return (
    <Form layout="vertical" className="media-form full-width" style={{ margin: 0 }}>
      <Row gutter={16}>
        <Col span={24}>
          <Title level={3}>Media</Title>
          <Text>Minimum size requirement for photos: 1024 × 683 pixels</Text>
          <br />
          {!readOnly && (
            <Dragger {...uploadProps} className="upload-box" style={{ height: '150px' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Drag and drop media here</p>
              <p className="ant-upload-hint">Supports JPG, PNG, and MP4</p>
            </Dragger>
          )}
          <div className="uploaded-files" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {formData.mediaFiles && formData.mediaFiles.map((file) => (
              <div key={file.uid} className="uploaded-file" style={{ marginRight: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {file.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(file.originFileObj)} alt={file.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                ) : (
                  <video src={URL.createObjectURL(file.originFileObj)} controls style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                )}
                <p style={{ marginTop: '5px', textAlign: 'center' }}>{file.name}</p>
              </div>
            ))}
          </div>
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

export default MediaForm;
