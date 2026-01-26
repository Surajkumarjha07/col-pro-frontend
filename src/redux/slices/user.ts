import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

const initialState = {
  token: token ?? "",
  user: token ? jwtDecode(token) : {},
};

export const UserSlice = createSlice({
  initialState,
  name: "User",
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    clearToken: (state) => {
      state.token = "";
    },
  },
});

export const { setUser, setToken, clearToken } = UserSlice.actions;
export default UserSlice.reducer;
