import { lazy } from "react";

// project imports

import Loadable from "@/components/Loadable";
import GuestGuard from "@/guards/GuestGuard";
const AuthLogin = Loadable(lazy(() => import("@/pages/admin/LoginFrm")));
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: "admin/login",
  element: (
    <GuestGuard>
      <AuthLogin />
    </GuestGuard>
  )
};
export default LoginRoutes;
