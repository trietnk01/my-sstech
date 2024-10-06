import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import styles from "@/assets/scss/login.module.scss";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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
interface IFormInput {
  email: string;
  password: string;
  remember_me: boolean;
}
const Login = () => {
  const { login } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const onSubmit: SubmitHandler<IFormInput> = (dataForm) => {
    login(dataForm.email.toString().trim(), dataForm.password.toString())
      .then((res) => {
        if (res) {
          Toast.fire({
            icon: "success",
            title: "Login successfully"
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "Login fail"
          });
        }
      })
      .catch((err: any) => {
        Toast.fire({
          icon: "error",
          title: err.message
        });
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.sectionLogin} name="loginFrm">
      <div className={styles.container}>
        <h1 className={styles.title}>LOGIN</h1>
        <div className={styles.inputBox}>
          <Controller
            name="email"
            defaultValue=""
            control={control}
            render={({ field }) => {
              return (
                <React.Fragment>
                  <input {...field} type="text" placeholder="Email" className={styles.inputTxt} />
                  {errors.email && <div className={styles.inputError}>{errors.email.message}</div>}
                  <div className={styles.iconBox}>
                    <UserOutlined className={styles.faBarsIcon} />
                  </div>
                </React.Fragment>
              );
            }}
          />
        </div>
        <div className={styles.inputBox}>
          <Controller
            name="password"
            defaultValue=""
            control={control}
            render={({ field }) => {
              return (
                <React.Fragment>
                  <input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className={styles.inputTxt}
                  />
                  {errors.password && (
                    <div className={styles.inputError}>{errors.password.message}</div>
                  )}
                  <div className={styles.iconBox}>
                    <KeyOutlined className={styles.faBarsIcon} />
                  </div>
                </React.Fragment>
              );
            }}
          />
        </div>
        <div className={styles.rembemberForgot}>
          <div className={styles.checkRememberMe}>
            <input type="checkbox" name="remember_me" />
            <span className={styles.rememberTxt}>Remember me</span>
          </div>
          <Link to="/login" className={styles.forgotPasswordLink}>
            Forgot password?
          </Link>
        </div>
        <button type="submit" className={styles.btnLogin}>
          Login
        </button>
        <div className={styles.donHaveAccountRegisterLink}>
          <span className={styles.dontHaveAccount}>Don't have account?</span>&nbsp;
          <Link to="/" className={styles.registerLink}>
            Register
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
