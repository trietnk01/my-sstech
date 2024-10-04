import { ComponentType, LazyExoticComponent, Suspense } from "react";

// material-ui

// project imports
import Loader from "./Loader";

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable =
  (Component: LazyExoticComponent<() => JSX.Element> | ComponentType<React.ReactNode>) =>
  (props: any) =>
    (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );

export default Loadable;
