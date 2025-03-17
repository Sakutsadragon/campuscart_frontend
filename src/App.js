import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import SLogin from './pages/sLogin';
import SRegister from './pages/sRegister';
import Addcoupon from './pages/Addcoupon';
import Addproduct from './pages/Addproduct';
import Updateproduct from './pages/Updateproduct';
import Currentorders from './pages/CurrentOrders';
import Completedorders from './pages/CompletedOrders';
import SHome from './pages/SHome';
import Sellerproducts from './pages/Sellerproduct';
import Viewproduct from './pages/Viewproduct';
import AvailableCoupons from './pages/AvailableCoupons';
import TrackOrder from './pages/TrackOrder';
import PreviousOrders from './pages/PreviousOrders';
import AvailableProducts from './pages/Availableproducts';
import Purchasingpage from './pages/Purchasingpage';
import OrderPlaced from './pages/OrderPlaced';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Cart from './pages/Cart';
library.add(fas);


export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shome" element={<SHome />} />
          <Route path="/sregister" element={<SRegister/>} />
          <Route path="/slogin" element={<SLogin />} />
          <Route path="/add-product" element={<Addproduct />} />
          <Route path="/update-product/:id" element={<Updateproduct />} />
          <Route path="/add-coupon" element={<Addcoupon />} />
          <Route path="/current-orders" element={<Currentorders />} />
          <Route path="/completed-orders" element={<Completedorders />} />
          <Route path="/sellerproducts" element={<Sellerproducts />} /> 
          <Route path="/viewproduct" element={<Viewproduct/>}/>
          <Route path="/scoupons" element={<AvailableCoupons/>}/>
          <Route path="/track-order" element={<TrackOrder/>}/>
          <Route path="/previous-orders" element={<PreviousOrders/>}/>
          <Route path="/available-products" element={<AvailableProducts />} />
          <Route path="/purchasingpage" element={<Purchasingpage />} />
          <Route path="/order-success" element={< OrderPlaced/>} />
          <Route path="/cart" element={< Cart/>} />
          
          
        </Routes>
      </BrowserRouter>
  );
}
