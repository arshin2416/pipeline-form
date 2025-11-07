import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent";

const { ApperFileUploader } = window.ApperSDK;

const ContactModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  contact = null,
  title = "Add Contact" 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    files_1_c: [],
    files_3_c: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalFiles1C, setOriginalFiles1C] = useState([]);
  const [originalFiles3C, setOriginalFiles3C] = useState([]);

  useEffect(() => {
    
    if (contact) {
      
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        notes: contact.notes || "",
        files_1_c: contact.files_1_c || [],
        files_3_c: contact.files_3_c || []
      });
      
      // Store original files data
      if (contact.files_1_c && Array.isArray(contact.files_1_c)) {
        setOriginalFiles1C(contact.files_1_c);
      } else {
        setOriginalFiles1C([]);
      }
      
      if (contact.files_3_c && Array.isArray(contact.files_3_c)) {
        setOriginalFiles3C(contact.files_3_c);
      } else {
        setOriginalFiles3C([]);
      }
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
        files_1_c: [],
        files_3_c: []
      });
      setOriginalFiles1C([]);
      setOriginalFiles3C([]);
    }
    setErrors({});
  }, [contact, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.company.trim()) newErrors.company = "Company is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Get all files from the file field components
      const allFiles = ApperFileUploader.FileField.getAllFiles();
      
      // Merge form data with files
      const dataToSave = {
        ...formData,
        files_1_c: allFiles.files_1_c || [],
        files_3_c: allFiles.files_3_c || []
      };
      
      await onSave(dataToSave);
      
      // Clear file fields after successful save
      ApperFileUploader.FileField.clearAll();
      
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            required
            placeholder="John Doe"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            required
            placeholder="john@example.com"
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="(555) 123-4567"
          />

          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            error={errors.company}
            required
            placeholder="Acme Corporation"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Additional notes about this contact..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Files 1
            </label>
            <ApperFileFieldComponent
              elementId="files_1_c"
              config={{
                fieldKey: 'files_1_c',
                tableName: 'contact_c',
                fieldName: 'files_1_c',
                apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                apperPublicKey: '123',
                existingFiles: originalFiles1C,
                fileCount: 2, 
                uploadButtonConfig:{
                  hidden: false,
                  disabled: false,
                },
                purpose: 'RecordAttachment',
                onMetadataLoaded: (metadata) => {
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Files 3
            </label>
            <ApperFileFieldComponent
              elementId="files_3_c"
              config={{
                fieldKey: 'files_3_c',
                tableName: 'contact_c',
                fieldName: 'files_3_c',
                apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                apperPublicKey: '123',
                existingFiles: originalFiles3C,
                fileCount: 2, 
                uploadButtonConfig:{
                  hidden: false,
                  disabled: false,
                },
                purpose: 'RecordAttachment',
                onMetadataLoaded: (metadata) => {
                }
              }}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : contact ? "Update Contact" : "Add Contact"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;