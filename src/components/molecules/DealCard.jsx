import React from "react";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, getDaysInStage } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const DealCard = ({ 
  deal, 
  contact, 
  onEdit, 
  onDelete,
  isDragging = false,
  className 
}) => {
  const daysInStage = getDaysInStage(deal.movedToStageAt);
  
  const stageColors = {
    "Lead": "border-l-slate-400",
    "Qualified": "border-l-blue-400", 
    "Proposal": "border-l-amber-400",
    "Negotiation": "border-l-orange-400",
    "Closed Won": "border-l-green-400",
    "Closed Lost": "border-l-red-400"
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md",
        "transition-all duration-200 cursor-grab active:cursor-grabbing",
        "border-l-4",
        stageColors[deal.stage] || "border-l-slate-400",
        isDragging && "drag-preview",
        className
      )}
      draggable
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar name={contact?.name} size="sm" />
          <div>
            <h4 className="font-medium text-slate-900 text-sm">{deal.title}</h4>
            <p className="text-xs text-slate-600">{contact?.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(deal)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <ApperIcon name="Edit" className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(deal.Id)}
            className="p-1 text-slate-400 hover:text-error-500 rounded"
          >
            <ApperIcon name="Trash2" className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">
            {formatCurrency(deal.value)}
          </span>
          <Badge variant="default" className="text-xs">
            {deal.probability}% likely
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{daysInStage} days in stage</span>
          <span>ID: {deal.Id}</span>
        </div>
      </div>
    </div>
  );
};

export default DealCard;