import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/admin/product/list");
  }, []);
  return <React.Fragment>HomePage</React.Fragment>;
};

export default HomePage;
