import { configureStore } from "@reduxjs/toolkit";
import authChecker from "./features/firebase/authChecker";

export default configureStore({
  reducer: {
    authchecker: authChecker,
  },
});
