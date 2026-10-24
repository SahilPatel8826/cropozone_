// App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './components/Admin/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderConfirmationPage from './pages/orderConfirmationPage';
import OrderManagement from './components/Admin/OrderManagement';

import {Provider} from "react-redux";
import store from "./redux/store";
import ProtectedRoute from './components/Common/ProtectedRoute';
import ScrollToTop from './components/Common/ScrollToTop';
import Wishlist from './pages/Wishlist';
const App = () => {
  return (
    <Provider store ={store}>
    <BrowserRouter>
      <PayPalScriptProvider
        options={{
          'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
        }}
      >
        <Toaster position="top-right" />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="collections/:collection" element={<CollectionPage />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="checkout" element={<Checkout />} />
           
            
            <Route path='orders' element={<OrderManagement/>}/>
          </Route>
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
        </Routes>
      </PayPalScriptProvider>
    </BrowserRouter>
    </Provider>
  );
};

export default App;
