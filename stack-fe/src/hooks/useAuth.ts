import React from "react";
import JWTContext from "@/contexts/jwt-context";

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => {
  const context = React.useContext(JWTContext);
  if (!context) throw new Error("context must be use inside provider");
  return context;
};

export default useAuth;
