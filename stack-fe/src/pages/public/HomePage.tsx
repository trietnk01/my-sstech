import styles from "@/assets/scss/public-layout.module.scss";
import PublicContext from "@/contexts/public-context";
import INews from "@/types/i-news";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/admin/product/list");
  }, []);
  return <React.Fragment>HomePage</React.Fragment>;
};

export default HomePage;
