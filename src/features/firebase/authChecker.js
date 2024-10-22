import { createSlice } from "@reduxjs/toolkit";

export const authChecker = createSlice({
  name: "authchecker",
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    authenticate: (state) => {
      state.isAuthenticated = true;
    },
    deauthenticate: (state) => {
      state.isAuthenticated = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { authenticate, deauthenticate } = authChecker.actions;

export default authChecker.reducer;
