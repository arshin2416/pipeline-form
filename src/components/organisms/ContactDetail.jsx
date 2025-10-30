import React, { useState, useEffect } from "react";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ActivityItem from "@/components/molecules/ActivityItem";
import ApperIcon from "@/components/ApperIcon";
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent";
import StandaloneUploaderExample from "@/components/atoms/FileUploader/StandaloneUploaderExample";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ContactDetail = ({ 
  contact, 
  deals, 
  activities, 
  isOpen, 
  onClose, 
  onEdit 
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [originalFiles1C, setOriginalFiles1C] = useState([]);
  const [originalFiles3C, setOriginalFiles3C] = useState([]);

  // Load original files when contact changes
  useEffect(() => {
    if (contact) {
      
      // Store original files_1_c data
      if (contact.files_1_c && Array.isArray(contact.files_1_c)) {
        setOriginalFiles1C(contact.files_1_c);
      } else {
        setOriginalFiles1C([]);
      }
      
      // Store original files_3_c data
      if (contact.files_3_c && Array.isArray(contact.files_3_c)) {
        setOriginalFiles3C(contact.files_3_c);
      } else {
        setOriginalFiles3C([]);
      }
    }
  }, [contact]);

  const contactDeals = deals.filter(deal => deal.contactId === contact?.Id);
  const contactActivities = activities
    .filter(activity => activity.contactId === contact?.Id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!contact || !isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-slate-200 z-40 transform transition-transform duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <Avatar name={contact.name} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{contact.name}</h2>
              <p className="text-sm text-slate-600">{contact.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: "info", label: "Info", icon: "User" },
            { id: "deals", label: "Deals", icon: "Briefcase" },
            { id: "activity", label: "Activity", icon: "Activity" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors",
                activeTab === tab.id
                  ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === "info" && (
            <div className="p-6 space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={() => onEdit(contact)}
                  size="sm"
                  variant="secondary"
                >
                  <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                  Edit Contact
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Email</label>
                  <p className="text-slate-900">{contact.email || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Phone</label>
                  <p className="text-slate-900">{contact.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Company</label>
                  <p className="text-slate-900">{contact.company || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Notes</label>
                  <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg">
                    {contact.notes || "No notes added yet."}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Created</label>
                  <p className="text-slate-900">{formatDate(contact.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-2 block">Files 1 </label>
                  <ApperFileFieldComponent
                    elementId="files_1_c"
                    config={{
                      fieldId: 'files_1_c',
                      tableNameOrId: 'contact_c',
                      fieldNameOrId: 'files_1_c',
                      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                      apperPublicKey: '123',
                      existingFiles: originalFiles1C,
                      fileCount: 2,
                      uploadButtonConfig:{
                        hidden: true,
                        disabled: false,
                      },
                      purpose: 'RecordAttachment',
                      onMetadataLoaded: (metadata) => {
                      }
                    }}
                  />
                
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-500 mb-2 block">Files 3</label>
                  <ApperFileFieldComponent
                    elementId="files_3_c"
                    config={{
                      fieldId: 'files_3_c',
                      tableNameOrId: 'contact_c',
                      fieldNameOrId: 'files_3_c',
                      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                      apperPublicKey: '123',
                      existingFiles: originalFiles3C,
                      fileCount: 2, 
                      uploadButtonConfig:{
                        hidden: true,
                        disabled: false,
                      },
                      purpose: 'RecordAttachment',
                      onMetadataLoaded: (metadata) => {
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "deals" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900">
                  Deals ({contactDeals.length})
                </h3>
              </div>
              {contactDeals.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Briefcase" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No deals yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactDeals.map((deal) => (
                    <div key={deal.Id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">{deal.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            ${deal.value.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="primary">{deal.stage}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900">
                  Activity Timeline ({contactActivities.length})
                </h3>
              </div>
              {contactActivities.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {contactActivities.map((activity) => (
                    <ActivityItem key={activity.Id} activity={activity} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;