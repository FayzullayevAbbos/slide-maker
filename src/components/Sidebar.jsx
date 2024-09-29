import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useGetOngoingSlides from "../hooks/useGetOngoingSlides";

function Sidebar({ collapsed }) {
  const [selectedKey, setSelectedKey] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { slides , loading , fetchSlides } = useGetOngoingSlides();

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const newItems = [
      getItem(
        "Created slides",
        "1",
        "/",
        <PieChartOutlined style={{ fontSize: "20px" }} />,
      ),
      getItem(
        "Create slide",
        "2",
        "/new-slide",
        <FileOutlined style={{ fontSize: "20px" }} />,
      ),
      // getItem(
      //   "Ongoing slides",
      //   "sub1",
      //   null,
      //   <UserOutlined style={{ fontSize: "20px" }} />,
      //   slides?.map((slide, i) =>
      //     getItem(
      //       slide.projectName,
      //       3 + i,
      //       "/ongoing-slides/" + slide.projectName,
      //     )
      //   ),
      // ),
    ];
  
    setMenuItems(newItems);
  }, [slides]);
    
  function getItem(label, key, route, icon, children) {
    return {
      key,
      icon,
      children,
      label: (
        <span style={{ fontSize: "18px", fontWeight: "medium" }}>
          {label}
        </span>
      ),
      onClick: () => handleMenuItemClick(route, key),
    };
  }

  const handleMenuItemClick = (route, key) => {
    if (route) {
      setSelectedKey(key);
      navigate(route);
    }
  };

  useEffect(() => {
    // location bo'yicha `selectedKey`ni yangilash
    if (location.pathname === "/") {
      setSelectedKey("1");
    } else if (location.pathname.startsWith("/new-slide")) {
      setSelectedKey("2");
    } else if (location.pathname.startsWith("/ongoing-slides/tom")) {
      setSelectedKey("3");
    } else if (location.pathname.startsWith("/ongoing-slides/bill")) {
      setSelectedKey("4");
    } else if (location.pathname.startsWith("/ongoing-slides/alex")) {
      setSelectedKey("5");
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [location]);
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className='min-h-screen '
      width={250}
    >
      <div className='text-white text-center mt-5 text-2xl font-bold pb-10'>
        <span
          className={`${
            !collapsed
              ? "logo1"
              : "logo2 bg-[#254195b3] text-xl p-3 rounded-md"
          }`}
        >
          Boss
        </span>
      </div>

      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={[selectedKey]}
        items={menuItems}
      />
    </Sider>
  );
}

export default Sidebar;
