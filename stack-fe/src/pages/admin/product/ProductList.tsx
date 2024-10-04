import styles from "@/assets/scss/admin-layout.module.scss";
import axios from "@/utils/axios";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, GetProp, Input, Space, Table, TableProps } from "antd";
import { produce } from "immer";
import ldash from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
interface IProducts {
  key: React.Key;
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
const ProductList = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = React.useState<IProducts[]>([]);
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
  const loadProductTable = (keyword: string, current: string | undefined) => {
    axios
      .get("/product/list", {
        params: {
          q: keyword ? keyword : undefined,
          page: current ? current.toString() : "1",
          limit: tableParams.pagination?.pageSize?.toString()
        }
      })
      .then((res) => {
        if (res && res.data) {
          const { statusCode, data } = res.data;
          if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
            const { list, total } = data;
            setLoading(false);
            const items: IProducts[] = list;
            const nextState: IProducts[] = produce(items, (drafState) => {
              drafState.forEach((item) => {
                item.key = item.id;
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
          }
        }
      })
      .catch(() => {});
  };
  React.useEffect(() => {
    setLoading(true);
    loadProductTable("", tableParams.pagination?.current?.toString());
  }, [tableParams.pagination?.current]);
  const handleSearch = () => {
    setLoading(true);
    loadProductTable(keyword, "1");
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
  const handleDeleteMulti = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: "Do you want to delete this item?",
        showDenyButton: true,
        confirmButtonText: "Confirm",
        denyButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "Please choose at least one item to delete"
      });
    }
  };
  const handleTableChange: TableProps["onChange"] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setProductData([]);
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
          <Button type="primary" icon={<SearchOutlined />} size="large" onClick={handleSearch} />
        </div>
        <div className={styles.actionBox}>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAddItem} />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            size="large"
            danger
            onClick={handleDeleteMulti}
          />
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
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
