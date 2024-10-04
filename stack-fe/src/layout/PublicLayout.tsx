import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default PublicLayout;
