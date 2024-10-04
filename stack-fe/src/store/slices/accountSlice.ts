import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IUser from "@/types/user-profile";
interface IProps {
  isLoggedIn: boolean;
  user: IUser | null;
}
const initialState: IProps = {
  isLoggedIn: false,
  user: null
};
const slice = createSlice({
  name: "account-slice",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<IUser>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logoutAction: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    }
  }
});
export default slice.reducer;
export const { loginAction, logoutAction } = slice.actions;
