import useAuth from "@/hooks/useAuth";
import styles from "@/assets/scss/login.module.scss";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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
  const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
    login(dataForm.email.toString().trim(), dataForm.password.toString());
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
          <Link to="/login" className={styles.registerLink}>
            Register
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
