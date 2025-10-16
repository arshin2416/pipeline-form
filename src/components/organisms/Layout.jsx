import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import Sidebar from "@/components/organisms/Sidebar";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
{/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded flex items-center justify-center">
              <ApperIcon name="BarChart3" className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">Pipeline Pro</span>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          <Outlet context={{ logout: useAuth().logout }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;