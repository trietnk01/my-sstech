import { createSlice } from "@reduxjs/toolkit";

interface ISnackbar {
  open: boolean;
}
const initialState: ISnackbar = {
  open: false
};

// ==============================|| SLICE - SNACKBAR ||============================== //

const snackbar = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openSnackbar(state) {
      state.open = true;
    },

    closeSnackbar(state) {
      state.open = false;
    }
  }
});

export default snackbar.reducer;

export const { closeSnackbar, openSnackbar } = snackbar.actions;
