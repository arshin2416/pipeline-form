import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Pipeline from "@/components/pages/Pipeline";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  showSearch = false,
  onAddContact,
  onAddDeal,
  onLogout
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Pipeline Pro</h1>
          </div>
          {title && title !== "Pipeline Pro" && (
            <>
              <div className="w-px h-6 bg-slate-300"></div>
              <h2 className="text-lg font-medium text-slate-700">{title}</h2>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {showSearch && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search contacts..."
              className="w-80"
            />
          )}
          <div className="flex items-center space-x-2">
            <Button onClick={onAddContact} size="sm" variant="secondary">
              <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
            <Button onClick={onAddDeal} size="sm">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
            {onLogout && (
              <Button onClick={onLogout} size="sm" variant="outline">
                <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;