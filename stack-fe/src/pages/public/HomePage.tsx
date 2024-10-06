import { Button, Card, Flex, Form, FormProps, Input, Select } from "antd";
import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/axios";
type FieldType = {
  username: string;
  password: string;
  password_confirmed: string;
  email: string;
  fullname: string;
};
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 8000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
const HomePage = () => {
  const [frmSignup] = Form.useForm();
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password, password_confirmed, email, fullname } = values;
    try {
      let checked: boolean = true;
      if (password.length >= 6 && password_confirmed.length >= 6) {
        if (password !== password_confirmed) {
          frmSignup.setFields([
            {
              name: "password_confirmed",
              errors: ["Password confirmed is not matched to password"]
            }
          ]);
          checked = false;
        }
      } else {
        if (password.length < 6) {
          frmSignup.setFields([
            { name: "password", errors: ["Password length must be greater than 6 characters"] }
          ]);
          checked = false;
        }
        if (password_confirmed.length < 6) {
          frmSignup.setFields([
            {
              name: "password",
              errors: ["Password confirmed length must be greater than 6 characters"]
            }
          ]);
          checked = false;
        }
      }
      if (checked) {
        let dataSaved: any = {
          username,
          email,
          password,
          fullname
        };
        let res: any = await axios.post("/user/register", dataSaved, {
          headers: { isShowLoading: true, "content-type": "application/json" }
        });
        const { statusCode, message } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          Toast.fire({
            icon: "success",
            title: "Register successfully"
          });
          setTimeout(() => {
            navigate(`/admin/login`);
          }, 2000);
        } else {
          Toast.fire({
            icon: "error",
            title: message
          });
        }
      }
    } catch (err: any) {
      Toast.fire({
        icon: "error",
        title: err.message
      });
    }
  };
  const handleLogin = () => {
    navigate("/admin/login");
  };
  return (
    <Form
      form={frmSignup}
      layout="vertical"
      onFinish={onFinish}
      name="newsFrm"
      style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card
        title="Register"
        extra={
          <Button type="primary" size="large" onClick={handleLogin}>
            Login
          </Button>
        }
        style={{ width: 300 }}
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Please input valid email"
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password retype"
          name="password_confirmed"
          rules={[{ required: true, message: "Please input your retyped password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<FieldType>
          label="Fullname"
          name="fullname"
          rules={[{ required: true, message: "Please input your fullname!" }]}
        >
          <Input />
        </Form.Item>
        <Button htmlType="submit" type="primary" size="large">
          Submit
        </Button>
      </Card>
    </Form>
  );
};

export default HomePage;
