import React from "react";
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaClipboardList, FaCog } from "react-icons/fa";
import "../Adminstyles/DashboardSettings.css";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<FaUsers />}>
          <Link to="/dashboard">Manage Users</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<FaBox />}>
          <Link to="/ManageItems">List Items</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<FaClipboardList />}>
          <Link to="/ShowItems">Listed Items</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<FaCog />}>
          <Link to="/profile">Settings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
