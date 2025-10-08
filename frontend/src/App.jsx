import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyCart from './pages/MyCart';
import MyProfile from './pages/MyProfile';
import Work from './pages/Work';
import Navbar from './components/Navbar';
import Footer from './ui/Footer';
import PrivacyAndRefund from './pages/PrivacyAndRefund';
import ShippingPolicy from './pages/ShippingPolicy';
import { ToastContainer } from 'react-toastify';
import Reviews from './pages/Reviews';
import OrderSuccess from './pages/OrderSuccess';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <div className="mx-2 xs:mx-8 sm:mx-[3%]  ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:workId" element={<Work />} />
        <Route path="/gallery/:workId/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-cart" element={<MyCart />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/policies/privacy-and-refund"
          element={<PrivacyAndRefund />}
        />
        <Route path="/policies/shipping" element={<ShippingPolicy />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
