import React from "react";
import { dispatch, useSelector } from "@/store";
import { loginAction, logoutAction } from "@/store/slices/accountSlice";
import IUser from "@/types/user-profile";
import JWTContext from "@/contexts/jwt-context";
import axios from "@/utils/axios";
const JWTProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { isLoggedIn, user } = useSelector((state) => state.account);
  React.useEffect(() => {
    const init = async () => {
      try {
        let isValid: boolean = true;
        const token: string = window.localStorage.getItem("access_token") as string;
        if (!token) {
          isValid = false;
        } else {
          const res: any = await axios.get("/auth/check-valid-token", {
            params: { token },
            headers: { isShowLoading: true }
          });
          const { statusCode, data } = res.data;
          if (parseInt(statusCode) !== 200 && parseInt(statusCode) !== 201) {
            isValid = false;
          } else {
            if (!data) {
              isValid = false;
            } else {
              const user: IUser = data;
              window.localStorage.setItem("access_token", token);
              dispatch(loginAction(user));
            }
          }
        }
        if (!isValid) {
          window.localStorage.removeItem("access_token");
          dispatch(logoutAction());
        }
      } catch (err: any) {
        console.log("err = ", err.message);
      }
    };
    init();
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    let isValid: boolean = true;
    try {
      const res: any = await axios.post(
        "/auth/login",
        { username: email, password },
        { headers: { isShowLoading: true } }
      );
      const { statusCode, data } = res.data;
      if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
        const { id, username, email, fullname, token } = data;
        const user: IUser = { id, username, email, fullname, token };
        window.localStorage.setItem("access_token", token);
        dispatch(loginAction(user));
      } else {
        isValid = false;
      }
    } catch (err: any) {
      isValid = false;
    }
    return isValid;
  };
  const logout = async () => {
    const res = await axios.post("/auth/logout", { headers: { isShowLoading: true } });
    if (res && res.data) {
      const { statusCode, message, data } = res.data;
      if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
        window.localStorage.removeItem("access_token");
        dispatch(logoutAction());
      }
    }
  };
  return (
    <JWTContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </JWTContext.Provider>
  );
};
export default JWTProvider;
