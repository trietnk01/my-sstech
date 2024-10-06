import styles from "@/assets/scss/admin-layout.module.scss";
import styleProductDetail from "@/assets/scss/product-detail.module.scss";
import useAuth from "@/hooks/useAuth";
import IMediaSource from "@/types/media-source";
import { BackwardFilled, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  Image,
  Input,
  Row,
  Select,
  Space,
  Splitter
} from "antd";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "@/utils/axios";
interface IReviews {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
interface IMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}
interface IDimension {
  width: number;
  height: number;
  depth: number;
}
type FieldType = {
  title?: string;
  description?: string;
  category?: string;
  images?: string[];
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: IDimension;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: IReviews[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: IMeta[];
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
    const loadProductDetail = async () => {
      if (
        searchParams.get("action") &&
        searchParams.get("id") &&
        searchParams.get("action") === "edit"
      ) {
        frmProduct.resetFields();
        const res: any = await axios.get(`/product/detail/${searchParams.get("id")?.toString()}`, {
          headers: { isShowLoading: true }
        });
        const { statusCode, data } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          const {
            title,
            description,
            category,
            price,
            discountPercentage,
            rating,
            stock,
            tags,
            brand,
            sku,
            weight,
            dimensions,
            warrantyInformation,
            shippingInformation,
            availabilityStatus,
            reviews,
            returnPolicy,
            minimumOrderQuantity,
            meta,
            images
          } = data;
          console.log("dimensions = ", dimensions);
          frmProduct.setFieldValue("title", title);
          frmProduct.setFieldValue("description", description);
          frmProduct.setFieldValue("category", category);
          frmProduct.setFieldValue("price", price);
          frmProduct.setFieldValue("discountPercentage", discountPercentage);
          frmProduct.setFieldValue("rating", rating);
          frmProduct.setFieldValue("stock", stock);
          frmProduct.setFieldValue("tags", tags);
          frmProduct.setFieldValue("brand", brand);
          frmProduct.setFieldValue("sku", sku);
          frmProduct.setFieldValue("weight", weight);
          frmProduct.setFieldValue("dimensions", dimensions);
          frmProduct.setFieldValue("warrantyInformation", warrantyInformation);
          frmProduct.setFieldValue("shippingInformation", shippingInformation);
          frmProduct.setFieldValue("availabilityStatus", availabilityStatus);
          frmProduct.setFieldValue("reviews", reviews);
          frmProduct.setFieldValue("returnPolicy", returnPolicy);
          frmProduct.setFieldValue("minimumOrderQuantity", minimumOrderQuantity);
          frmProduct.setFieldValue("meta", meta);
          frmProduct.setFieldValue("images", images);
        }
      }
    };
    loadProductDetail();
  }, [searchParams.get("id"), searchParams.get("action")]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {};
  return (
    <Form form={frmProduct} layout="vertical" onFinish={onFinish} name="frmProduct">
      <Row>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <h2 className={styles.titleHeading}>Create product</h2>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Flex justify="flex-end" gap={10}>
                <Button
                  type="primary"
                  icon={<BackwardFilled />}
                  size="large"
                  danger
                  onClick={handleBack}
                />
              </Flex>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col span={12}>
              {frmProduct.getFieldValue("images") &&
              frmProduct.getFieldValue("images").length > 0 ? (
                <Image
                  src={frmProduct.getFieldValue("images")[0]}
                  width={600}
                  className={styleProductDetail.productImage}
                />
              ) : (
                <React.Fragment></React.Fragment>
              )}
            </Col>
            <Col span={12}>
              <Splitter style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", padding: 20 }}>
                <Splitter.Panel>
                  <Row>
                    <Col span={12}>
                      <div className={styleProductDetail.productLabel}>Title</div>
                      <div>{frmProduct.getFieldValue("title")}</div>
                    </Col>
                    <Col span={12}>
                      <div className={styleProductDetail.productLabel}>Dimensions</div>
                      <div>
                        {frmProduct.getFieldValue("dimensions") ? (
                          <Space size="small">
                            <div>Width: {frmProduct.getFieldValue("dimensions")["width"]}</div>
                            <div>Height: {frmProduct.getFieldValue("dimensions")["height"]}</div>
                            <div>Depth: {frmProduct.getFieldValue("dimensions")["depth"]}</div>
                          </Space>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Category</div>
                      <div>{frmProduct.getFieldValue("category")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Price</div>
                      <div>{frmProduct.getFieldValue("price")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Discount Percentage</div>
                      <div>{frmProduct.getFieldValue("discountPercentage")}</div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Rating</div>
                      <div>{frmProduct.getFieldValue("rating")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Stock</div>
                      <div>{frmProduct.getFieldValue("stock")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Tags</div>
                      {frmProduct.getFieldValue("tags") &&
                      frmProduct.getFieldValue("tags").length > 0 ? (
                        <div>
                          <Space size="small">
                            {frmProduct.getFieldValue("tags").map((elmt: string, idx: number) => {
                              return elmt;
                            })}
                          </Space>
                        </div>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Brand</div>
                      <div>{frmProduct.getFieldValue("brand")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Sku</div>
                      <div>{frmProduct.getFieldValue("sku")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Weight</div>
                      <div>{frmProduct.getFieldValue("weight")}</div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Warranty Information</div>
                      <div>{frmProduct.getFieldValue("warrantyInformation")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Shipping Information</div>
                      <div>{frmProduct.getFieldValue("shippingInformation")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Availability Status</div>
                      <div>{frmProduct.getFieldValue("availabilityStatus")}</div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Return Policy</div>
                      <div>{frmProduct.getFieldValue("returnPolicy")}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>MinimumOrder Quantity</div>
                      <div>{frmProduct.getFieldValue("minimumOrderQuantity")}</div>
                    </Col>
                    <Col span={8}></Col>
                  </Row>
                </Splitter.Panel>
              </Splitter>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
export default ProductFrm;
