import React, { useState, useEffect } from "react";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent";
import { formatDateRelative } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const { ApperFileUploader } = window.ApperSDK;

const ContactRow = ({ 
  contact, 
  dealCount = 0, 
  onSelect, 
  onEdit, 
  onDelete,
  onUpdate,
  isSelected = false
}) => {
  const [originalFiles1C, setOriginalFiles1C] = useState([]);
  const [originalFiles3C, setOriginalFiles3C] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  // Load original files when contact changes
  useEffect(() => {
    if (contact) {
      
      // Store original files_1_c data
      if (contact.files_1_c && Array.isArray(contact.files_1_c) && contact.files_1_c.length > 0) {
        setOriginalFiles1C(contact.files_1_c);
      } else {
        setOriginalFiles1C([]);
      }
      
      // Store original files_3_c data
      if (contact.files_3_c && Array.isArray(contact.files_3_c) && contact.files_3_c.length > 0) {
        setOriginalFiles3C(contact.files_3_c);
      } else {
        setOriginalFiles3C([]);
      }

      // Initialize edited data
      setEditedData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
      });
    }
  }, [contact]);

  const handleEditToggle = (e) => {
    e.stopPropagation();
    if (isEditing) {
      // Cancel editing - reset to original values
      setEditedData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    
    if (!onUpdate) {
      console.error('onUpdate callback not provided');
      return;
    }

    setIsSaving(true);
    try {
      // Get files from the file field components
      const files1CFieldId = `files_1_c_${contact.Id}`;
      const files3CFieldId = `files_3_c_${contact.Id}`;
      
      const files1C = ApperFileUploader.FileField.getFiles(files1CFieldId) || [];
      const files3C = ApperFileUploader.FileField.getFiles(files3CFieldId) || [];
      
      const updateData = {
        ...editedData,
        files_1_c: files1C,
        files_3_c: files3C,
      };

      await onUpdate(contact.Id, updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr 
      className={cn(
        "transition-colors",
        !isEditing && "hover:bg-slate-50 cursor-pointer",
        isSelected && "bg-primary-50",
        isEditing && "bg-blue-50"
      )}
      onClick={() => !isEditing && onSelect(contact)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <Avatar name={contact.name} size="md" />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-2 py-1 text-sm font-medium border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Email"
                />
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium text-slate-900">{contact.name}</div>
                <div className="text-sm text-slate-500">{contact.email}</div>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editedData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Company"
          />
        ) : (
          <div className="text-sm text-slate-900">{contact.company}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editedData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Phone"
          />
        ) : (
          <div className="text-sm text-slate-900">{contact.phone}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={dealCount > 0 ? "primary" : "default"}>
          {dealCount} deals
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {formatDateRelative(contact.lastContactDate)}
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        
         <div className="min-w-[200px]">
            <ApperFileFieldComponent
              elementId={`files_1_c_${contact.Id}`}
              config={{
                fieldKey: `files_1_c_${contact.Id}`,
                tableName: 'contact_c',
                fieldName: 'files_1_c',
                apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                apperPublicKey: '123',
                existingFiles: originalFiles1C,
                showUploadedFilesInPopOver: true,
                fileCount: 3,
                uploadButtonConfig:{
                  hidden: false,
                  disabled: false,
                  iconOnly: true
                },
                purpose: 'RecordAttachment',
                onMetadataLoaded: (metadata) => {
                }
              }}
            />
          </div>
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
       
           <div className="min-w-[200px]">
            <ApperFileFieldComponent
              elementId={`files_3_c_${contact.Id}`}
              config={{
                fieldKey: `files_3_c_${contact.Id}`,
                tableName: 'contact_c',
                fieldName: 'files_3_c',
                apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                apperPublicKey: '123',
                existingFiles: originalFiles3C,
                showUploadedFilesInPopOver: true,
                fileCount: 3,
                uploadButtonConfig:{
                  hidden: false,
                  disabled: false,
                  iconOnly: true
                },
                purpose: 'RecordAttachment',
                onMetadataLoaded: (metadata) => {
                }
              }}
            />
          </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 rounded transition-colors"
                title="Save changes"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <ApperIcon name="Loader" className="h-3 w-3 mr-1 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ApperIcon name="Save" className="h-3 w-3 mr-1" />
                    Save
                  </span>
                )}
              </button>
              <button
                onClick={handleEditToggle}
                disabled={isSaving}
                className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 rounded transition-colors"
                title="Cancel editing"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditToggle}
                className="text-slate-400 hover:text-primary-600 transition-colors"
                title="Edit inline"
              >
                <ApperIcon name="Edit3" className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(contact);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Edit in modal"
              >
                <ApperIcon name="Edit" className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(contact.Id);
                }}
                className="text-slate-400 hover:text-error-500 transition-colors"
                title="Delete contact"
              >
                <ApperIcon name="Trash2" className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ContactRow;