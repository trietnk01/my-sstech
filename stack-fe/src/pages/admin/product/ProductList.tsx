import styles from "@/assets/scss/admin-layout.module.scss";
import axios from "@/utils/axios";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
const ProductList = () => {
  const navigate = useNavigate();
  const [categoryProductData, setCategoryProductData] = React.useState<ICategoryProduct[]>([]);
  const [productData, setProductData] = React.useState<IProducts[]>([]);
  const [categoryProductId, setCategoryProductId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });
  const columns: TableProps<IProducts>["columns"] = [
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
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <React.Fragment>
            <Space size="middle">
              <Button type="primary" onClick={handleEdit(record.id)}>
                Edit
              </Button>
            </Space>
          </React.Fragment>
        );
      }
    }
  ];
  const handleEdit = (id: number) => () => {
    navigate(`/admin/product/form?action=edit&id=${id}`);
  };
  const handleAddItem = () => {
    navigate("/admin/product/form?action=add");
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
        if (res && res.data) {
          const { statusCode, data, message } = res.data;
          console.log("res.data = ", res.data);
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
  }, [tableParams.pagination?.current]);
  React.useEffect(() => {
    const loadSelectedCategoryProduct = async () => {
      const res: any = await axios.get("/product/category", { headers: { isShowLoading: false } });
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
    };
    loadSelectedCategoryProduct();
  }, []);
  const handleSearch = () => {
    setLoading(true);
    loadProductTable(keyword, categoryProductId, "1");
    let nextState = ldash.cloneDeep(tableParams);
    if (nextState.pagination && nextState.pagination.current) {
      nextState.pagination.current = 1;
      setTableParams(nextState);
    }
  };
  const handleKeywordChange = (e: any) => {
    setKeyword(e.target.value.toString());
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
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
          <Button type="primary" icon={<SearchOutlined />} size="large" onClick={handleSearch} />
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
