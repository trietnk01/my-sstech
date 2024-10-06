import React from "react";
import IUser from "@/types/user-profile";
interface JWTContextType {
  isLoggedIn: boolean;
  user: IUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
const JWTContext = React.createContext<JWTContextType | null>(null);
export default JWTContext;
