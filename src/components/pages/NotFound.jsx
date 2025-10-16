import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8">
          <ApperIcon name="Search" className="w-12 h-12 text-primary-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary-600 to-primary-700"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Back to Pipeline
          </Button>
          
          <Button
            onClick={() => navigate("/contacts")}
            variant="secondary"
          >
            <ApperIcon name="Users" className="w-4 h-4 mr-2" />
            View Contacts
          </Button>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg border border-slate-200 max-w-md mx-auto">
          <h2 className="font-medium text-slate-900 mb-2">Need help?</h2>
          <p className="text-sm text-slate-600">
            Use the navigation menu to access your pipeline, contacts, or analytics dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;