import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [isLoggedIn, user]);

  return children;
};

export default AuthGuard;
