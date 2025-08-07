import React, { useEffect, useState } from "react";
import { useFormContext } from "../../FormContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Form, Row, Col, Input, Button, message, Space, Card, Upload, Typography, Checkbox } from 'antd';
import { 
  InfoCircleOutlined, HomeOutlined, PictureOutlined, AppstoreOutlined, DollarOutlined, InboxOutlined 
} from '@ant-design/icons';
import { updateItem } from "../../Api/ManageitemsAPI";

const { Content } = Layout;
const { Dragger } = Upload;
const { Title, Text } = Typography;

const UpdateForm = ({ visible, onCancel = () => {}, onUpdate }) => {
  const { setFormData, activeTab, setActiveTab, formData, updateFormData } = useFormContext();
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item; // Retrieve item from location state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If item is undefined, do not set formData
    if (item) {
      console.log("Initial item data:", item);
      console.log("Complete item object:", JSON.stringify(item, null, 2));
      
      // Check how media files are stored in your database
      if (item.mediaFiles) {
        console.log("Raw mediaFiles from server:", item.mediaFiles);
        
        // Your backend structure from the model: { url: String, type: String }
        // We need to map this to the structure expected by antd Upload component
        let mediaFiles = [];
        try {
          if (Array.isArray(item.mediaFiles)) {
            console.log("MediaFiles is an array with length:", item.mediaFiles.length);
            
            mediaFiles = item.mediaFiles.map((file, index) => {
              // Create a file object compatible with Upload component
              return {
                uid: `-${index}`,
                name: file.url.split('/').pop() || `file-${index}.jpg`,
                status: 'done',
                url: file.url,
                type: file.type === 'image' ? 'image/jpeg' : 'video/mp4',
              };
            });
            
            console.log("Processed media files:", mediaFiles);
          } else {
            console.warn("mediaFiles exists but is not an array:", typeof item.mediaFiles);
          }
        } catch (error) {
          console.error("Error processing mediaFiles:", error);
        }
        
        // Update the formData with processed media files
        setFormData({
          ...item,
          mediaFiles: mediaFiles,
        });
      } else {
        // Try to find media files in other properties
        console.log("No mediaFiles property found, looking for alternatives");
        console.log("item.media:", item.media);
        console.log("item.images:", item.images);
        console.log("item.photos:", item.photos);
        
        // Set mediaFiles from whichever property actually contains your media
        if (item.media) item.mediaFiles = item.media;
        else if (item.images) item.mediaFiles = item.images;
        else if (item.photos) item.mediaFiles = item.photos;
      }
      
      // Ensure mediaFiles is always an array and process it properly
      let mediaFiles = [];
      
      try {
        if (item.mediaFiles) {
          // If it's a string (like a JSON string), try to parse it
          if (typeof item.mediaFiles === 'string') {
            try {
              const parsedFiles = JSON.parse(item.mediaFiles);
              console.log("Parsed media files from string:", parsedFiles);
              if (Array.isArray(parsedFiles)) {
                item.mediaFiles = parsedFiles;
              }
            } catch (e) {
              console.error("Error parsing mediaFiles string:", e);
            }
          }
          
          // Now process the array (or what should be an array)
          if (Array.isArray(item.mediaFiles) && item.mediaFiles.length > 0) {
            console.log("Processing mediaFiles array with", item.mediaFiles.length, "items");
            
            // Log the first item to see its structure
            if (item.mediaFiles[0]) {
              console.log("First media file structure:", item.mediaFiles[0]);
              console.log("First media file properties:", Object.keys(item.mediaFiles[0]));
            }
            
            mediaFiles = item.mediaFiles.map((file, index) => {
              // Create a valid file object for Ant Design's Upload
              const fileObj = {
                uid: file._id || file.uid || `-${index}`,
                name: file.name || file.filename || `file-${index}.jpg`,
                status: 'done',
                url: file.url || file.path || (typeof file === 'string' ? file : undefined),
                type: file.type || file.contentType || 
                      (file.url && file.url.match(/\.(mp4|mov|avi)$/i) ? 'video/mp4' : 'image/jpeg')
              };
              
              console.log(`Processed file ${index}:`, fileObj);
              return fileObj;
            });
          } else {
            console.warn("mediaFiles is not an array or is empty:", item.mediaFiles);
          }
        } else {
          console.warn("No mediaFiles property found in item");
        }
      } catch (error) {
        console.error("Error processing media files:", error);
      }
      
      console.log("Final processed media files for form:", mediaFiles);
      
      setFormData({
        ...item,
        mediaFiles: mediaFiles,
      });
      console.log("item is : ", item);
    }
  }, [item, setFormData]);

  const handleCancel = () => {
    onCancel();
    navigate(-1); // Navigate back to the previous page
  };

  // Track if media files have been changed by user
  const [mediaFilesChanged, setMediaFilesChanged] = useState(false);
  
  // Log whenever activeTab changes to see if we're visiting the media tab
  useEffect(() => {
    console.log(`Tab changed to: ${activeTab}`);
    if (activeTab === "media") {
      console.log("Current mediaFiles:", formData.mediaFiles);
      console.log("mediaFilesChanged state:", mediaFilesChanged);
    }
  }, [activeTab, formData.mediaFiles, mediaFilesChanged]);

  // Reset mediaFilesChanged when component unmounts
  useEffect(() => {
    return () => {
      setMediaFilesChanged(false);
    };
  }, []);

  const handleSubmit = async () => {
    // Validate all fields before submitting
    if (!formData.description || !formData.personCapacity || !formData.propertyType || !formData.roomType || !formData.numBedrooms || !formData.numBeds || !formData.numBathrooms || !formData.bathroomType || !formData.numGuestBathrooms || !formData.address?.publicAddress || !formData.address?.country || !formData.address?.state || !formData.address?.city || !formData.address?.street || !formData.address?.zipCode || !formData.amenities || formData.amenities.length === 0 || !formData.pricing?.pricePerNight || !formData.pricing?.pricePerWeek || !formData.pricing?.pricePerMonth) {
      message.error("Please fill all the fields before submitting.");
      return;
    }

    console.log("Before submission - mediaFiles:", formData.mediaFiles);
    console.log("Before submission - mediaFiles details:", formData.mediaFiles?.map(f => ({
      name: f.name,
      hasUrl: !!f.url, 
      hasOriginFileObj: !!f.originFileObj,
      type: f.type
    })));
    console.log("Before submission - mediaFilesChanged:", mediaFilesChanged);

    setIsSubmitting(true);
    try {
      // Create a completely new object instead of spreading formData
      // This ensures mediaFiles won't be included unless we explicitly add it
      const updatedFormData = {
        _id: formData._id,
        listingName: formData.listingName,
        externalListingName: formData.externalListingName,
        tags: formData.tags,
        description: formData.description,
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        personCapacity: formData.personCapacity,
        numBedrooms: formData.numBedrooms,
        numBeds: formData.numBeds,
        numBathrooms: formData.numBathrooms,
        bathroomType: formData.bathroomType,
        numGuestBathrooms: formData.numGuestBathrooms,
        address: formData.address,
        pricing: formData.pricing,
        amenities: formData.amenities,
        status: formData.status,
      };
      
      // Handle mediaFiles - the key change is here
      if (mediaFilesChanged) {
        // If media files were changed by user, send the new files
        console.log("Including modified mediaFiles in request");
        if (formData.mediaFiles && formData.mediaFiles.length > 0) {
          updatedFormData.mediaFiles = formData.mediaFiles.map(file => file.originFileObj ? file.originFileObj : file);
        } else {
          console.log("Warning: mediaFiles is empty after user changes");
          updatedFormData.mediaFiles = [];
        }
      } else if (item && item.mediaFiles) {
        // If media files weren't changed, send the original mediaFiles from the item
        // This prevents the server from emptying the mediaFiles
        console.log("Including original mediaFiles to prevent them from being cleared");
        updatedFormData.mediaFiles = item.mediaFiles;
      }
      
      console.log("Final request payload:", updatedFormData);
      console.log("mediaFiles included in payload:", 'mediaFiles' in updatedFormData);
      
      const result = await updateItem(formData._id, updatedFormData);
      console.log("result is : ", result);
      // If mediaFilesChanged is true but mediaFiles is empty, warn the user
      if (mediaFilesChanged && (!formData.mediaFiles || formData.mediaFiles.length === 0)) {
        const confirmEmpty = window.confirm(
          "You are about to update this item with no media files. This will remove all existing images. Continue?"
        );
        if (!confirmEmpty) {
          return;
        }
      }
      if (result.message) {
        setMediaFilesChanged(false);
        message.success(result.message);
        navigate(-1); // Navigate back to the previous page
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("An error occurred while updating the item.");
      console.log("sent form data is : ", formData);
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const handleNext = (currentTab) => {
    // Validate form fields based on the current tab
    switch (currentTab) {
      case "basic":
        if (!formData.description || !formData.personCapacity || !formData.propertyType || !formData.roomType || !formData.numBedrooms || !formData.numBeds || !formData.numBathrooms || !formData.bathroomType || !formData.numGuestBathrooms) {
          message.error("Please fill all the fields in Basic Info.");
          return;
        }
        setActiveTab("address");
        break;
      case "address":
        if (!formData.address?.publicAddress || !formData.address?.country || !formData.address?.state || !formData.address?.city || !formData.address?.street || !formData.address?.zipCode) {
          message.error("Please fill all the fields in Address.");
          return;
        }
        setActiveTab("media");
        break;
      case "media":
        if (!formData.mediaFiles || formData.mediaFiles.length === 0) {
          message.error("Please select at least one media file.");
          return;
        }
        setActiveTab("amenities");
        break;
      case "amenities":
        if (!formData.amenities || formData.amenities.length === 0) {
          message.error("At least one amenity must be selected.");
          return;
        }
        setActiveTab("price");
        break;
      default:
        break;
    }
  };

  const MediaForm = ({ readOnly = false }) => {
    const { formData, updateFormData, setActiveTab } = useFormContext();
    
    // Add fileList state to control the Upload component
    const [fileList, setFileList] = useState([]);

    // Initialize fileList when formData.mediaFiles changes
    useEffect(() => {
      console.log("MediaForm: formData.mediaFiles changed:", formData.mediaFiles);
      if (formData.mediaFiles && formData.mediaFiles.length > 0) {
        setFileList(formData.mediaFiles);
      }
    }, [formData.mediaFiles]);
  
    // Add logging for mediaFiles in the MediaForm
    useEffect(() => {
      console.log("MediaForm rendered with files:", formData.mediaFiles);
      console.log("MediaFiles type:", Array.isArray(formData.mediaFiles) ? "Array" : typeof formData.mediaFiles);
      console.log("MediaFiles length:", formData.mediaFiles?.length || 0);
      
      // Log each file's properties to debug issues
      if (Array.isArray(formData.mediaFiles) && formData.mediaFiles.length > 0) {
        formData.mediaFiles.forEach((file, idx) => {
          console.log(`File ${idx} properties:`, Object.keys(file));
          console.log(`File ${idx} has URL:`, !!file.url);
          console.log(`File ${idx} has originFileObj:`, !!file.originFileObj);
        });
      }
    }, [formData.mediaFiles]);
  
    const uploadProps = {
      name: "file",
      multiple: true,
      accept: "image/png, image/jpeg, image/jpg, video/mp4",
      fileList: fileList, // Control the file list
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
        console.log("Upload onChange called with fileList:", info.fileList);
        setFileList(info.fileList); // Update local fileList state
        
        const uniqueFiles = [];
        const fileNames = new Set();
        info.fileList.forEach((file) => {
          if (!fileNames.has(file.name)) {
            uniqueFiles.push(file);
            fileNames.add(file.name);
          }
        });
        
        // Only update mediaFiles if user actually uploads or removes files
        if (info.fileList.length > 0) {
          console.log("Updating mediaFiles with new uploads:", uniqueFiles);
          updateFormData({ mediaFiles: uniqueFiles });
          setMediaFilesChanged(true);
          console.log("Set mediaFilesChanged to true");
        } else if (info.fileList.length === 0 && formData.mediaFiles.length > 0) {
          // User cleared all files
          console.log("User cleared all files, setting empty mediaFiles");
          updateFormData({ mediaFiles: [] });
          setMediaFilesChanged(true);
          console.log("Set mediaFilesChanged to true");
        } else {
          console.log("No change to mediaFiles");
        }
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
              {formData.mediaFiles && formData.mediaFiles.map((file, idx) => (
                <div
                  key={file.uid || file.name || idx} // Ensure unique key for each file
                  className="uploaded-file"
                  style={{ marginRight: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  {file.type && file.type.startsWith("image/") ? (
                    file.originFileObj ? (
                      <img src={URL.createObjectURL(file.originFileObj)} alt={file.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    ) : (
                      <img src={file.url} alt={file.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    )
                  ) : (
                    file.originFileObj ? (
                      <video src={URL.createObjectURL(file.originFileObj)} controls style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    ) : (
                      <video src={file.url} controls style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    )
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

  const AmenitiesForm = ({ readOnly = false }) => {
    const { formData, updateFormData } = useFormContext();
  
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
  
    // Handle checkbox changes for both groups
    const handleCheckboxChange = (checkedValues) => {
      console.log("Amenities updated:", checkedValues);
      updateFormData({ amenities: checkedValues });
    };

    // Convert amenities to an array of individual strings
    let currentAmenities = [];
    if (formData.amenities) {
      if (Array.isArray(formData.amenities)) {
        // If it's an array with a single comma-separated string, split it
        if (formData.amenities.length === 1 && typeof formData.amenities[0] === 'string' && formData.amenities[0].includes(',')) {
          currentAmenities = formData.amenities[0].split(',').map(item => item.trim());
        } 
        // If it's already an array of individual strings, use it as is
        else {
          currentAmenities = formData.amenities;
        }
      } 
      // If it's a comma-separated string, split it
      else if (typeof formData.amenities === 'string') {
        currentAmenities = formData.amenities.split(',').map(item => item.trim());
      }
    }
    
    // Remove duplicates
    currentAmenities = [...new Set(currentAmenities)];
    
    console.log("Current amenities type:", typeof formData.amenities);
    console.log("Current amenities value:", formData.amenities);
    console.log("Processed amenities for checkboxes:", currentAmenities);
  
    return (
      <Form layout="vertical" className="amenities-form full-width" style={{ margin: 0 }}>
        <Row gutter={16}>
          <Col span={24}>
            <h3 className="amenities-title">Common Amenities</h3>
            <Checkbox.Group
              options={commonAmenities}
              value={currentAmenities}
              onChange={handleCheckboxChange}
              className="amenities-checkbox-group"
              disabled={readOnly}
            />
            <h3 className="amenities-title">Additional Amenities</h3>
            <Checkbox.Group
              options={additionalAmenities}
              value={currentAmenities}
              onChange={handleCheckboxChange}
              className="amenities-checkbox-group"
              disabled={readOnly}
            />
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', minHeight: '100vh' }}>
        <Card style={{ width: '100%', padding: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Item</h2>
          <Space wrap style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Button
              type="default"
              style={activeTab === "basic" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("basic")}
              icon={<InfoCircleOutlined />}
            >
              Basic Info
            </Button>
            <Button
              type="default"
              style={activeTab === "address" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("address")}
              icon={<HomeOutlined />}
            >
              Address
            </Button>
            <Button
              type="default"
              style={activeTab === "media" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("media")}
              icon={<PictureOutlined />}
            >
              Media
            </Button>
            <Button
              type="default"
              style={activeTab === "amenities" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("amenities")}
              icon={<AppstoreOutlined />}
            >
              Amenities
            </Button>
            <Button
              type="default"
              style={activeTab === "price" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("price")}
              icon={<DollarOutlined />}
            >
              Price and Fees
            </Button>
          </Space>
          {activeTab === "basic" && (
            <Form layout="vertical" className="basic-info-form full-width" style={{ margin: 0 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <h3 className="form-title">Basic Information</h3>
                  <Form.Item label="Description">
                    <Input
                      value={formData?.description || ""}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Person Capacity">
                    <Input
                      value={formData?.personCapacity || ""}
                      onChange={(e) => updateFormData({ personCapacity: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Property Type">
                    <Input
                      value={formData?.propertyType || ""}
                      onChange={(e) => updateFormData({ propertyType: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Room Type">
                    <Input
                      value={formData?.roomType || ""}
                      onChange={(e) => updateFormData({ roomType: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Number of Bedrooms">
                    <Input
                      value={formData?.numBedrooms || ""}
                      onChange={(e) => updateFormData({ numBedrooms: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Number of Beds">
                    <Input
                      value={formData?.numBeds || ""}
                      onChange={(e) => updateFormData({ numBeds: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Number of Bathrooms">
                    <Input
                      value={formData?.numBathrooms || ""}
                      onChange={(e) => updateFormData({ numBathrooms: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Bathroom Type">
                    <Input
                      value={formData?.bathroomType || ""}
                      onChange={(e) => updateFormData({ bathroomType: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Number of Guest Bathrooms">
                    <Input
                      value={formData?.numGuestBathrooms || ""}
                      onChange={(e) => updateFormData({ numGuestBathrooms: e.target.value })}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} className="text-right">
                  <Button type="primary" onClick={() => handleNext("basic")}>
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {activeTab === "address" && (
            <Form layout="vertical" className="address-form full-width" style={{ margin: 0 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <h3 className="form-title">Address</h3>
                  <Form.Item label="Public Address">
                    <Input
                      value={formData?.address?.publicAddress || ""}
                      onChange={(e) => updateFormData({ address: { ...formData.address, publicAddress: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="Country">
                    <Input
                      value={formData?.address?.country || ""}
                      onChange={(e) => updateFormData({ address: { ...formData.address, country: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="State">
                    <Input
                      value={formData?.address?.state || ""}
                      onChange={(e) => updateFormData({ address: { ...formData.address, state: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="City">
                    <Input
                      value={formData?.address?.city || ""}
                      onChange={(e) => updateFormData({ address: { ...formData.address, city: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="Street">
                    <Input
                      value={formData?.address?.street || ""}
                      onChange={(e) => updateFormData({ address: { ...formData.address, street: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="Zip Code">
                    <Input
                      value={formData?.address?.zipCode || ""}
                      onChange={(e) => updateFormData({ address: { ...formData.address, zipCode: e.target.value } })}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} className="text-right">
                  <Button type="primary" onClick={() => handleNext("address")}>
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {activeTab === "media" && (
            <>
              <MediaForm />
            </>
          )}
          {activeTab === "amenities" && (
            <>
              <AmenitiesForm />
              <Row>
                <Col xs={24} className="text-right">
                  <Button type="primary" onClick={() => handleNext("amenities")}>
                    Next
                  </Button>
                </Col>
              </Row>
            </>
          )}
          {activeTab === "price" && (
            <Form layout="vertical" className="price-form full-width" style={{ margin: 0 }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Price per Night" className="form-item">
                    <Input
                      name="pricePerNight"
                      placeholder="Enter Price per Night"
                      value={formData?.pricing?.pricePerNight || ""}
                      onChange={(e) => updateFormData({ pricing: { ...formData.pricing, pricePerNight: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="Price per Week" className="form-item">
                    <Input
                      name="pricePerWeek"
                      placeholder="Enter Price per Week"
                      value={formData?.pricing?.pricePerWeek || ""}
                      onChange={(e) => updateFormData({ pricing: { ...formData.pricing, pricePerWeek: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="Price per Month" className="form-item">
                    <Input
                      name="pricePerMonth"
                      placeholder="Enter Price per Month"
                      value={formData?.pricing?.pricePerMonth || ""}
                      onChange={(e) => updateFormData({ pricing: { ...formData.pricing, pricePerMonth: e.target.value } })}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Weekly Discount (%)" className="form-item">
                    <Input
                      name="weeklyDiscount"
                      placeholder="Enter Weekly Discount"
                      value={formData?.pricing?.weeklyDiscount || ""}
                      onChange={(e) => updateFormData({ pricing: { ...formData.pricing, weeklyDiscount: e.target.value } })}
                    />
                  </Form.Item>
                  <Form.Item label="Monthly Discount (%)" className="form-item">
                    <Input
                      name="monthlyDiscount"
                      placeholder="Enter Monthly Discount"
                      value={formData?.pricing?.monthlyDiscount || ""}
                      onChange={(e) => updateFormData({ pricing: { ...formData.pricing, monthlyDiscount: e.target.value } })}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="primary" onClick={handleSubmit} className="submit-button" disabled={isSubmitting}>
                  Update
                </Button>
                <Button type="default" onClick={handleCancel} className="cancel-button" style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </Content>
    </Layout>
  );
};



export default UpdateForm;
