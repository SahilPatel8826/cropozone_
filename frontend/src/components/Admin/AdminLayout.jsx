import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import {Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white items-center z-20">
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      <div
        className={`bg-gray-800 text-white w-64 min-h-screen absolute md:relative z-30 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 md:static md:block`}
      >
        {/* {Sidebar} */}
        <AdminSidebar/>
      </div>

      {/* {Main Content} */}
      <div className='flex-grow p-6 overflow-auto'>
        <Outlet/>
      </div>
    </div>
   )
  
};

export default AdminLayout;
