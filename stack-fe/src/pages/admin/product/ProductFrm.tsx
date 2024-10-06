import styles from "@/assets/scss/admin-layout.module.scss";
import useAuth from "@/hooks/useAuth";
import IMediaSource from "@/types/media-source";
import { BackwardFilled, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Image, Input, Select } from "antd";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "@/utils/axios";
type FieldType = {
  title?: string;
  description?: string;
  category?: string;
  featuredImg?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  sku?: string;
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
};
interface ICategoryProduct {
  value: string;
  label: string;
}
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 8000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
const ProductFrm = () => {
  const navigate = useNavigate();
  const [frmProduct] = Form.useForm();
  const [productImage, setProductImage] = React.useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryProductData, setCategoryProductData] = React.useState<ICategoryProduct[]>([]);
  const handleBack = () => {
    navigate("/admin/product/list");
  };
  React.useEffect(() => {
    const loadSelectedCategoryProduct = () => {
      axios
        .get(`/product/category`)
        .then((res) => {
          const { statusCode, data } = res.data;
          if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
            let categoryProductList: ICategoryProduct[] = data.map((item: any) => {
              return { value: item.id, label: item.category_name };
            });
            categoryProductList.unshift({
              value: "",
              label: "-- Please choose on category --"
            });
            setCategoryProductData(categoryProductList);
          }
        })
        .catch((err: any) => {});
    };
    loadSelectedCategoryProduct();
  }, []);
  React.useEffect(() => {
    const onReset = () => {
      frmProduct.setFieldValue("title", "");
      frmProduct.setFieldValue("category", "");
      frmProduct.setFieldValue("featuredImg", "");
      frmProduct.setFieldValue("description", "");
    };
    const loadProductDetail = async () => {
      if (
        searchParams.get("action") &&
        searchParams.get("id") &&
        searchParams.get("action") === "edit"
      ) {
        const res: any = await axios.get(`/product/detail/${searchParams.get("id")?.toString()}`, {
          headers: { isShowLoading: true }
        });
        const { statusCode, data } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          const { title, description, category, images, price } = data;
          frmProduct.setFieldValue("title", title);
          frmProduct.setFieldValue("category", category);
          frmProduct.setFieldValue("description", description);
          setProductImage(images[0]);
        }
      }
    };
    onReset();
    loadProductDetail();
  }, [searchParams.get("id"), searchParams.get("action")]);
  return (
    <div>
      <h2 className={styles.titleHeading}>Create product</h2>
    </div>
  );
};
export default ProductFrm;
