import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileSidebar from './MobileSidebar';

const Layout = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
  
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    return (
      <div className="w-full h-screen flex flex-col md:flex-row">
        <div className="w-1/6 h-screen bg-white sticky top-0 hidden md:block">
          <Sidebar />
        </div>
        <MobileSidebar />
        <div className="flex-1 overflow-y-auto">
          <Navbar />
          <div className="p-4 2xl:px-10">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };
  
  export default Layout;