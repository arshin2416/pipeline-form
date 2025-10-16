import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { formatDateRelative } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      deal_created: "Plus",
      deal_updated: "Edit",
      contact_created: "UserPlus"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-600 bg-blue-100",
      email: "text-green-600 bg-green-100", 
      meeting: "text-purple-600 bg-purple-100",
      note: "text-amber-600 bg-amber-100",
      deal_created: "text-emerald-600 bg-emerald-100",
      deal_updated: "text-orange-600 bg-orange-100",
      contact_created: "text-indigo-600 bg-indigo-100"
    };
    return colors[type] || "text-slate-600 bg-slate-100";
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        getActivityColor(activity.type)
      )}>
        <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900">{activity.description}</p>
        <p className="text-xs text-slate-500 mt-1">
          {formatDateRelative(activity.timestamp)} • {activity.createdBy}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;