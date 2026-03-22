import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import stockReducer from "./stockSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    stock: stockReducer
  }
});