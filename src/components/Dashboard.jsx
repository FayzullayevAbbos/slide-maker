import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Spin, message } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
function Dashboard({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className='h-full '>
      <Sidebar collapsed={collapsed} />
      <Layout className='site-layout'>
        <Header
          className='flex items-center justify-between '
          style={{ padding: 0, background: "white" }}
        >
          <Button
            type='text'
            icon={
              collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className='mr-5'
          >
            Logout
            <LogoutOutlined />
          </Button>
        </Header>

        <Content className='p-3 h-full  '>
          <div className='bg-white h-full rounded-xl  overflow-y-auto  '>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
