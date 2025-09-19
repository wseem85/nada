import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import AdminContextProvider from './contexts/AdminContext';
import Dashboard from './pages/Dashboard';
import { AdminContext, AppContext } from './contexts/contexts';
import AllWorks from './pages/AllWorks';
import Work from './pages/Work';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import UploadWork from './pages/UploadWork';
import Logo from './components/Logo';

const App = () => {
  const { serverConnected } = useContext(AppContext);
  const { admin, isLoadingAdmin } = useContext(AdminContext);

  // Show loading screen while checking authentication
  if (isLoadingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7ecec] via-beige-light to-[#faf7f0] flex items-center justify-center">
        <div className="text-center">
          <Logo />
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mt-8 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!serverConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7ecec] via-beige-light to-[#faf7f0] flex  flex-col gap-12 items-center justify-center px-4 py-8 ">
        <Logo />
        <h3 className="text-2xl font-semibold">
          Opps , You Can not get to Dashboard
        </h3>
        <p className="text-gray-500 text-center">
          We are Sorry
          <br />
          Server May be down or Facing problems connecting our database <br />
          please check Your connection And reload page.
          <br />
          If this did not solve it , Please connect The developer
        </p>
      </div>
    );
  }

  return !admin?._id ? (
    <>
      <ToastContainer style={{ zIndex: 99999 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Redirect all other routes to login when not authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  ) : (
    <div className="">
      <ToastContainer style={{ zIndex: 99999 }} />
      <Navbar />
      <div className="flex">
        <SideBar />
        <div className=" flex-1 md:ml-60 pl-[20px] ml-4">
          <Routes>
            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-artworks" element={<AllWorks />} />
            <Route path="/all-artworks/:workId" element={<Work />} />
            <Route path="/upload-artwork" element={<UploadWork />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
