import React, { useState, useEffect } from "react";
import DealCard from "@/components/molecules/DealCard";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const PipelineBoard = ({ 
  deals, 
  contacts, 
  stages, 
  onEditDeal, 
  onDeleteDeal,
  onMoveDeal 
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (stageName) => {
    setDragOverStage(stageName);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      onMoveDeal(draggedDeal.Id, targetStage);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const getDealsForStage = (stageName) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const getStageValue = (stageName) => {
    const stageDeals = getDealsForStage(stageName);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const getContactForDeal = (dealId) => {
    const deal = deals.find(d => d.Id === dealId);
    return contacts.find(c => c.Id === deal?.contactId);
  };

  return (
    <div className="p-6">
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.name);
          const stageValue = getStageValue(stage.name);
          const isDragOver = dragOverStage === stage.name;

          return (
            <div
              key={stage.Id}
              className={cn(
                "flex-shrink-0 w-80 bg-slate-50 rounded-lg border-2 border-transparent transition-all duration-200",
                isDragOver && "drop-zone-active pulse-border"
              )}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(stage.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-slate-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 flex items-center">
                    <div 
                      className={cn("w-3 h-3 rounded-full mr-2", stage.color)}
                      style={{ backgroundColor: stage.color }}
                    />
                    {stage.name}
                  </h3>
                  <span className="text-sm text-slate-500">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(stageValue)}
                </p>
              </div>

              {/* Stage Content */}
              <div className="p-4 space-y-4 min-h-[200px] max-h-[600px] overflow-y-auto custom-scrollbar">
                {stageDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <ApperIcon name="Package" className="w-8 h-8 mb-2" />
                    <p className="text-sm">No deals yet</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.Id}
                      onDragStart={(e) => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
                    >
                      <DealCard
                        deal={deal}
                        contact={getContactForDeal(deal.Id)}
                        onEdit={onEditDeal}
                        onDelete={onDeleteDeal}
                        isDragging={draggedDeal?.Id === deal.Id}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBoard;