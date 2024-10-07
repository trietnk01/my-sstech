import { lazy } from "react";

// project imports

import Loadable from "@/components/Loadable";
const ProductList = Loadable(lazy(() => import("@/pages/admin/product/ProductList")));
const ProductFrm = Loadable(lazy(() => import("@/pages/admin/product/ProductFrm")));
import AdminLayout from "@/layout/AdminLayout";
import AuthGuard from "@/guards/AuthGuard";
// ==============================|| AUTH ROUTING ||============================== //

const AdminRoutes = {
  path: "admin",
  element: (
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: "product",
      children: [
        {
          path: "list",
          element: <ProductList />
        },
        {
          path: "form/:action/:productId",
          element: <ProductFrm />
        }
      ]
    }
  ]
};
export default AdminRoutes;
