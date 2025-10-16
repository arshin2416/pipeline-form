import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-slate-600 mb-6 max-w-sm">
        {message}
      </p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;