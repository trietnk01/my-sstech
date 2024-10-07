import styles from "@/assets/scss/admin-layout.module.scss";
import styleProductDetail from "@/assets/scss/product-detail.module.scss";
import axios from "@/utils/axios";
import { BackwardFilled } from "@ant-design/icons";
import { Button, Col, Flex, Form, Row, Space, Spin, Splitter } from "antd";
import React from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

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
interface IProductDetail {
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

const delayForProductImage = (proCom: any) => {
  return new Promise((myResolve) => {
    setTimeout(myResolve, 2000);
  }).then(() => proCom);
};
const ImageProduct = React.lazy(() => delayForProductImage(import("@/components/ImageProduct")));
const ProductFrm = () => {
  const navigate = useNavigate();
  const [frmProduct] = Form.useForm();
  const { action, productId } = useParams();
  const [productItem, setProductItem] = React.useState<IProductDetail>({});
  const handleBack = () => {
    navigate("/admin/product/list");
  };
  React.useEffect(() => {
    const loadProductDetail = async () => {
      if (action && productId && action === "detail") {
        setProductItem({});
        const res: any = await axios.get(`/product/detail/${productId.toString()}`, {
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
          setProductItem({
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
          });
          /* frmProduct.setFieldValue("title", title);
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
          frmProduct.setFieldValue("images", images); */
        }
      }
    };
    loadProductDetail();
  }, [productId, action]);
  console.log("title = ", frmProduct.getFieldValue("title"));
  return (
    <Form form={frmProduct} layout="vertical" name="frmProduct">
      <Row>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <h2 className={styles.titleHeading}>Product detail</h2>
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
            <Col span={8}>
              {productItem.images && productItem.images.length > 0 ? (
                <React.Fragment>
                  <React.Suspense
                    fallback={
                      <Flex
                        justify="center"
                        align="center"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <Spin size="large" />
                      </Flex>
                    }
                  >
                    <ImageProduct urlImage={productItem.images[0]} />
                  </React.Suspense>
                </React.Fragment>
              ) : (
                <React.Fragment></React.Fragment>
              )}
            </Col>
            <Col span={16}>
              <Splitter style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", padding: 20 }}>
                <Splitter.Panel>
                  <Row>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Title</div>
                      <div>{productItem.title ? productItem.title : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Dimensions</div>
                      <div>
                        {productItem.dimensions ? (
                          <Space size="small">
                            <div>Width: {productItem.dimensions["width"]}</div>
                            <div>Height: {productItem.dimensions["height"]}</div>
                            <div>Depth: {productItem.dimensions["depth"]}</div>
                          </Space>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </Col>
                    <Col span={8}></Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Category</div>
                      <div>{productItem.category ? productItem.category : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Price</div>
                      <div>{productItem.price ? productItem.price : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Discount Percentage</div>
                      <div>
                        {productItem.discountPercentage ? productItem.discountPercentage : ""}
                      </div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Rating</div>
                      <div>{productItem.rating ? productItem.rating : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Stock</div>
                      <div>{productItem.stock ? productItem.stock : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Tags</div>
                      {productItem.tags && productItem.tags.length > 0 ? (
                        <div>
                          <Space size="small">
                            {productItem.tags.map((elmt: string, idx: number) => {
                              return <div key={`tag-${idx}`}>{elmt}</div>;
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
                      <div>{productItem.brand ? productItem.brand : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Sku</div>
                      <div>{productItem.sku ? productItem.sku : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Weight</div>
                      <div>{productItem.weight ? productItem.weight : ""}</div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Warranty Information</div>
                      <div>
                        {productItem.warrantyInformation ? productItem.warrantyInformation : ""}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Shipping Information</div>
                      <div>
                        {productItem.shippingInformation ? productItem.shippingInformation : ""}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Availability Status</div>
                      <div>
                        {productItem.availabilityStatus ? productItem.availabilityStatus : ""}
                      </div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Return Policy</div>
                      <div>{productItem.returnPolicy ? productItem.returnPolicy : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>MinimumOrder Quantity</div>
                      <div>
                        {productItem.minimumOrderQuantity ? productItem.minimumOrderQuantity : ""}
                      </div>
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
