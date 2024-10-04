import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	isShow: false
};
const slice = createSlice({
	name: "loading-slice",
	initialState,
	reducers: {
		showLoading: (state) => {
			state.isShow = true;
		},
		hideLoading: (state) => {
			state.isShow = false;
		}
	}
});
export default slice.reducer;
export const { showLoading, hideLoading } = slice.actions;
