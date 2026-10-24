import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // correct path
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice"
import checkoutReducer from "./slices/checkoutSlice"
import orderReducer from "./slices/orderSlice"
import adminReducer from "./slices/adminSlice"
import adminProductReducer from "./slices/adminProductSlice"
import adminOrderReducer from "./slices/adminOrderSlice";
import wishlistReducer from "./slices/wishlistSlice";
// import  getDefaultMiddleware  from '@reduxjs/toolkit';
const store = configureStore({
  reducer: {
    auth: authReducer,  // <-- now the store has a valid reducer
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders:orderReducer,
    admin : adminReducer,
    adminProducts:adminProductReducer,
    adminOrders : adminOrderReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables this check
    }),
})

export default store;
