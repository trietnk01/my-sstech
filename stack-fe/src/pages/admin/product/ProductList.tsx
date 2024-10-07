import styles from "@/assets/scss/admin-layout.module.scss";
import axios from "@/utils/axios";
import { Button, GetProp, Input, Select, Space, Table, TableProps } from "antd";
import { produce } from "immer";
import ldash from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
interface IProducts {
  key: string;
  id: number;
  title: string;
  category: string;
  price: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
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
interface ICategoryProduct {
  value: string;
  label: string;
}
const TIMEOUT_DEBOUNCE = 30;
const ProductList = () => {
  const navigate = useNavigate();
  const [categoryProductData, setCategoryProductData] = React.useState<ICategoryProduct[]>([]);
  const [productData, setProductData] = React.useState<IProducts[]>([]);
  const [categoryProductId, setCategoryProductId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState<string>("");
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });
  const columns: TableProps<IProducts>["columns"] = [
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      render: (text) => text
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => text
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => text
    },
    {
      title: "In stock",
      dataIndex: "stock",
      key: "stock",
      render: (text) => text
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <React.Fragment>
            <Space size="middle">
              <Button type="primary" onClick={handleDetail(record.id)}>
                Detail
              </Button>
            </Space>
          </React.Fragment>
        );
      }
    }
  ];
  const handleDetail = (id: number) => () => {
    navigate(`/admin/product/form/detail/${id}`);
  };
  const loadProductTable = (
    keyword: string,
    categoryProductId: string,
    current: string | undefined
  ) => {
    axios
      .get("/product/list", {
        params: {
          q: keyword ? keyword.trim() : undefined,
          category_product_id: categoryProductId ? categoryProductId.toString().trim() : undefined,
          page: current ? current.toString() : "1",
          limit: tableParams.pagination?.pageSize?.toString()
        }
      })
      .then((res) => {
        const { statusCode, data, message } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          const { list, total } = data;
          setLoading(false);
          const items: IProducts[] = list;
          const nextState: IProducts[] = produce(items, (drafState) => {
            drafState.forEach((item) => {
              item.key = item.id.toString();
            });
          });
          setProductData(nextState);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total
            }
          });
        } else {
          Toast.fire({
            icon: "error",
            title: message
          });
        }
      })
      .catch((err: any) => {
        Toast.fire({
          icon: "error",
          title: err.message
        });
      });
  };
  React.useEffect(() => {
    setLoading(true);
    loadProductTable(keyword, categoryProductId, tableParams.pagination?.current?.toString());
  }, [keyword, categoryProductId, tableParams.pagination?.current]);
  React.useEffect(() => {
    const loadSelectedCategoryProduct = () => {
      axios.get("/product/category", { headers: { isShowLoading: false } }).then((res) => {
        const { statusCode, message, data } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          let categoryProductList: ICategoryProduct[] = data.map((elmt: any) => {
            return { value: elmt.id, label: elmt.category_name };
          });
          categoryProductList.unshift({
            value: "",
            label: "-- Please choose on category --"
          });
          setCategoryProductData(categoryProductList);
        }
      });
    };
    loadSelectedCategoryProduct();
  }, []);

  const handleKeywordChange = (e: any) => {
    const debounceSearch = ldash.debounce((search: string) => {
      setKeyword(search);
      let nextState = ldash.cloneDeep(tableParams);
      if (nextState.pagination && nextState.pagination.current) {
        nextState.pagination.current = 1;
        setTableParams(nextState);
      }
    }, TIMEOUT_DEBOUNCE);
    debounceSearch(e.target.value.toString());
  };

  const handleTableChange: TableProps<IProducts>["onChange"] = (pagination, filters) => {
    setTableParams({
      pagination,
      filters
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setProductData([]);
    }
  };
  const handleCategoryProductChange = (e: any) => {
    setCategoryProductId(e.toString());
    let nextState = ldash.cloneDeep(tableParams);
    if (nextState.pagination && nextState.pagination.current) {
      nextState.pagination.current = 1;
      setTableParams(nextState);
    }
  };

  return (
    <React.Fragment>
      <h2 className={styles.titleHeading}>Products</h2>
      <div className={styles.controlBox}>
        <div className={styles.filterBox}>
          <Input
            placeholder="Search..."
            size="large"
            className={styles.searchText}
            onChange={handleKeywordChange}
            value={keyword}
          />
          <Select
            size="large"
            defaultValue=""
            className={styles.selectedText}
            options={categoryProductData}
            onChange={handleCategoryProductChange}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={productData}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </React.Fragment>
  );
};

export default ProductList;
