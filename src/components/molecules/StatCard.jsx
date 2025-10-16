import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "h-4 w-4 mr-1",
                  trend === "up" ? "text-success-500" : "text-error-500"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-success-500" : "text-error-500"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="h-6 w-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;