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
  category: string;
  description?: string;
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
  const { user } = useAuth();
  const [frmProduct] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryProductData, setCategoryProductData] = React.useState<ICategoryProduct[]>([]);
  const [base64Url, setBase64Url] = React.useState<string>("");
  const [featuredImg, setFeaturedImg] = React.useState<IMediaSource | null>(null);
  const [removedFeaturedImg, setRemovedFeaturedImg] = React.useState<boolean>(false);
  const [newsHiddenImg, setNewsHiddenImg] = React.useState<string>("");
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { title, category, description } = values;
    if (searchParams.get("action")) {
      let dataSaved: any = {
        title,
        category,
        description
      };
      switch (searchParams.get("action")) {
        case "add":
          const res: any = await axios.post("/product/save", dataSaved, {
            headers: { isShowLoading: true }
          });
          const { statusCode, data } = res.data;
          if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
            const { id } = data;
            Toast.fire({
              icon: "success",
              title: "Create product successfully"
            });
            navigate(`/admin/product/form?action=edit&id=${id}`);
          }
          break;
        case "edit":
          if (searchParams.get("id")) {
            dataSaved["id"] = searchParams.get("id");
            const res: any = await axios.post("/product/save", dataSaved, {
              headers: { isShowLoading: true }
            });
            const { statusCode } = res.data;
            if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
              Toast.fire({
                icon: "success",
                title: "Update product successfully"
              });
            }
          }
          break;
      }
    }
  };
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
          const { title, description, category, price } = data;
          frmProduct.setFieldValue("title", title);
          frmProduct.setFieldValue("category", category);
          frmProduct.setFieldValue("description", description);
        }
      }
    };
    onReset();
    loadProductDetail();
  }, [searchParams.get("id"), searchParams.get("action")]);
  const handleUpload = (imageFile: any) => {
    setBase64Url(URL.createObjectURL(imageFile));
    setFeaturedImg(imageFile);
    setRemovedFeaturedImg(false);
  };
  const handleRemovedFeaturedImg = () => {
    setBase64Url("");
    setFeaturedImg(null);
    setRemovedFeaturedImg(true);
  };
  const handleTypeError = () => {
    Toast.fire({
      icon: "warning",
      title: "File type must be .png | .jpg"
    });
  };
  const handleSizeError = () => {
    Toast.fire({
      icon: "warning",
      title: "Image file size must be less then 500KB"
    });
  };
  const handleProductNew = () => {
    navigate("/admin/product/form?action=add");
  };
  return (
    <Form form={frmProduct} layout="vertical" onFinish={onFinish} name="newsFrm">
      <h2 className={styles.titleHeading}>Create product</h2>
      <Flex justify="flex-end" gap={10}>
        <Button htmlType="submit" type="primary" icon={<SaveOutlined />} size="large" />
        <Button type="primary" icon={<BackwardFilled />} size="large" danger onClick={handleBack} />
      </Flex>
      <div>
        <Form.Item<FieldType>
          label="Title"
          name="title"
          style={{ fontWeight: "bold" }}
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select category!" }]}
          initialValue=""
          style={{ fontSize: "bold" }}
          className={styles.categoryNewsBox}
        >
          <Select
            size="large"
            placeholder="Select a option and change input text above"
            options={categoryProductData}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Description"
          name="description"
          style={{ fontWeight: "bold" }}
          rules={[{ required: true, message: "Please input product description!" }]}
          className={styles.categoryNewsBox}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </div>
    </Form>
  );
};
export default ProductFrm;
