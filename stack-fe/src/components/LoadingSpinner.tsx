import { Flex, Spin } from "antd";
import React from "react";
import { useSelector } from "@/store";

const LoadingSpinner = () => {
  const { isShow } = useSelector((state) => state.loading);
  return (
    <React.Fragment>
      {isShow && (
        <div
          style={{
            position: "fixed",
            zIndex: "9990",
            display: "flex",
            left: "0",
            top: "0",
            backgroundColor: "rgb(0 0 0 / 77%)",
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </React.Fragment>
  );
};

export default LoadingSpinner;
