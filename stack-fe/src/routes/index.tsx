import { useRoutes } from "react-router-dom";

// routes

import PublicRoutes from "./PublicRoutes";
import LoginRoutes from "./LoginRoutes";
import AdminRoutes from "./AdminRoutes";
// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([PublicRoutes, LoginRoutes, AdminRoutes]);
}
