import { lazy } from "react";

// project imports
import Loadable from "@/components/Loadable";
import GuestGuard from "@/guards/GuestGuard";
import PublicLayout from "@/layout/PublicLayout";
const HomePage = Loadable(lazy(() => import("@/pages/public/HomePage")));
// ==============================|| AUTH ROUTING ||============================== //

const PublicRoutes = {
  path: "/",
  element: (
    <GuestGuard>
      <PublicLayout />
    </GuestGuard>
  ),
  children: [
    {
      path: "/",
      element: <HomePage />
    }
  ]
};
export default PublicRoutes;
