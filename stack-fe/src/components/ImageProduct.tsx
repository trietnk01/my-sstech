import { Flex, Image, Spin } from "antd";
import React from "react";
import { useSelector } from "@/store";
import styleProductDetail from "@/assets/scss/product-detail.module.scss";
interface ImageProductProps {
  urlImage: string;
}
const ImageProduct: React.FC<ImageProductProps> = ({ urlImage }) => {
  return <Image src={urlImage} className={styleProductDetail.productImage} />;
};

export default ImageProduct;
