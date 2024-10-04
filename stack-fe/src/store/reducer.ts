// third-party
import { combineReducers } from "redux";
import loadingSlice from "./slices/loadingSlice";
import accountSlice from "./slices/accountSlice";

// project imports

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({ loading: loadingSlice, account: accountSlice });

export default reducer;
