import React from "react";
import { useFormContext } from "../FormContext";
import Forms from "./Forms";
import { Button, Space, Layout, Card } from 'antd';
import { 
  InfoCircleOutlined, HomeOutlined, PictureOutlined, AppstoreOutlined, DollarOutlined, 
  InfoCircleTwoTone, ContactsOutlined, FileTextOutlined, FieldTimeOutlined, 
  IdcardOutlined, SettingOutlined, BankOutlined, UserOutlined 
} from '@ant-design/icons';

const { Content } = Layout;

const ManageItems = () => {
  const { activeTab, setActiveTab } = useFormContext();

  return (
    <Layout>
      <Content style={{ padding: '24px', minHeight: '100vh' }}>
        <Card style={{ width: '100%', padding: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Manage Items</h2>
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
            {/* <Button
              type="default"
              style={activeTab === "additionalInfo" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("additionalInfo")}
              icon={<InfoCircleTwoTone />}
            >
              Additional Info
            </Button>
            <Button
              type="default"
              style={activeTab === "contactPerson" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("contactPerson")}
              icon={<ContactsOutlined />}
            >
              Channel-Specific Contact Person
            </Button> */}
            {/* <Button
              type="default"
              style={activeTab === "invoicing" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("invoicing")}
              icon={<FileTextOutlined />}
            >
              Invoicing
            </Button>
            <Button
              type="default"
              style={activeTab === "attachment" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("attachment")}
              icon={<FieldTimeOutlined />}
            >
              Attachment
            </Button>
            <Button
              type="default"
              style={activeTab === "customFields" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("customFields")}
              icon={<SettingOutlined />}
            >
              Custom Fields
            </Button>
            <Button
              type="default"
              style={activeTab === "licenseInfo" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("licenseInfo")}
              icon={<IdcardOutlined />}
            >
              License Info
            </Button>
            <Button
              type="default"
              style={activeTab === "financialSettings" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("financialSettings")}
              icon={<BankOutlined />}
            >
              Financial Settings
            </Button> */}
            {/* <Button
              type="default"
              style={activeTab === "paymentAccounts" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("paymentAccounts")}
              icon={<UserOutlined />}
            >
              Payment Accounts
            </Button> */}
            {/* <Button
              type="default"
              style={activeTab === "guestPortal" ? { backgroundColor: '#007bff', color: '#fff' } : {}}
              onClick={() => setActiveTab("guestPortal")}
              icon={<UserOutlined />}
            >
              Guest Portal
            </Button> */}
          </Space>
          <Forms />
        </Card>
      </Content>
    </Layout>
  );
};

export default ManageItems;