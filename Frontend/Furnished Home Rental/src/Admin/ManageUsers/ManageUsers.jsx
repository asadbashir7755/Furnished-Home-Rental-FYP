import React, { useEffect } from "react";
import { useFormContext } from "../FormContext";
import { Layout, Table, Button, message, Modal, Select, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import "./ManageUsers.css";

const { Header, Content } = Layout;
const { Option } = Select;

const ManageUsers = () => {
  const context = useFormContext();
  if (!context) {
    console.error("useFormContext is undefined");
    return null;
  }

  const { users, fetchUsersData, handleDeleteUser, handleUpdateUserRole } = context;

  useEffect(() => {
    console.log("Users:", users);
    if (!users || users.length === 0) {
      fetchUsersData();
    }
  }, [users, fetchUsersData]);

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: () => handleDeleteUser(id),
    });
  };

  const handleRoleChange = async (id, role, originalRole) => {
    try {
      await handleUpdateUserRole(id, role);
    } catch (error) {
      message.error("Failed to update user role. Reverting to original role.");
      // Revert to original role if update fails
      const updatedUsers = users.map(user => user._id === id ? { ...user, role: originalRole } : user);
      setUsers(updatedUsers);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text, record) => (
        <Select defaultValue={text} onChange={(value) => handleRoleChange(record._id, value, text)}>
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => confirmDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Header className="header">Manage Users</Header>
      <Content className="container mt-5 pt-5">
        <Table dataSource={users || []} columns={columns} rowKey={(record) => record._id} />
      </Content>
    </Layout>
  );
};

export default ManageUsers;
