import styles from "@/assets/scss/admin-layout.module.scss";
import useAuth from "@/hooks/useAuth";
import { MailOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Flex, Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}
const items: MenuProps["items"] = [
  getItem("Menu", "sub1", <MailOutlined />, [
    getItem(
      "Product section",
      "g1",
      null,
      [getItem("Product", "1"), getItem("Logout", "2")],
      "group"
    )
  ])
];
const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const onClick: MenuProps["onClick"] = (e) => {
    const key: number = e.key ? parseInt(e.key) : 1;
    switch (key) {
      case 1:
        navigate("/admin/product/list");
        break;
      case 2:
        if (user) {
          logout();
        }
        break;
    }
  };

  return (
    <Flex justify="flex-start" align="flex-start" gap={20}>
      <Menu
        onClick={onClick}
        className={styles.colMenu}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
      <div className={styles.colMain}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </div>
    </Flex>
  );
};

export default AdminLayout;
