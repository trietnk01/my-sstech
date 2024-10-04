import { lazy } from "react";

// project imports

import Loadable from "@/components/Loadable";
import PublicLayout from "@/layout/PublicLayout";
const HomePage = Loadable(lazy(() => import("@/pages/public/HomePage")));
const VideoPage = Loadable(lazy(() => import("@/pages/public/VideoPage")));
// ==============================|| AUTH ROUTING ||============================== //

const PublicRoutes = {
  path: "/",
  element: <PublicLayout />,
  children: [
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/video",
      element: <VideoPage />
    }
  ]
};
export default PublicRoutes;
