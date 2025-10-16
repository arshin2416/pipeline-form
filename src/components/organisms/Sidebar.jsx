import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Pipeline", href: "/", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Analytics", href: "/analytics", icon: "TrendingUp" }
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden",
          isOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-out lg:hidden z-50",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900">Pipeline Pro</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary-100 text-primary-700 border-r-3 border-primary-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
          <div className="flex items-center px-6 py-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Pipeline Pro</span>
            </div>
          </div>
          <nav className="flex-1 mt-6 px-3">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary-100 text-primary-700 border-r-3 border-primary-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )
                    }
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;