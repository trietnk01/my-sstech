import { Skeleton } from "antd";
import styles from "@/assets/scss/admin-layout.module.scss";
const Loader = () => {
  return (
    <div className={styles.loaderBox}>
      <Skeleton active />
    </div>
  );
};

export default Loader;
