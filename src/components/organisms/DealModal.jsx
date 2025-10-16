import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const DealModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  deal = null,
  contacts = [],
  stages = [],
  title = "Add Deal" 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "Lead",
    probability: "25"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        value: deal.value ? deal.value.toString() : "",
        stage: deal.stage || "Lead",
        probability: deal.probability ? deal.probability.toString() : "25"
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "Lead",
        probability: "25"
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Deal title is required";
    if (!formData.contactId) newErrors.contactId = "Contact is required";
    if (!formData.value) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(formData.value) || parseFloat(formData.value) < 0) {
      newErrors.value = "Please enter a valid amount";
    }
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
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        contactId: parseInt(formData.contactId)
      };
      await onSave(dealData);
      onClose();
    } catch (error) {
      console.error("Error saving deal:", error);
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
            label="Deal Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            required
            placeholder="Enterprise Software License"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Contact <span className="text-error-500">*</span>
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => handleChange("contactId", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.name} ({contact.company})
                </option>
              ))}
            </select>
            {errors.contactId && (
              <p className="text-sm text-error-500">{errors.contactId}</p>
            )}
          </div>

          <Input
            label="Deal Value"
            type="number"
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            error={errors.value}
            required
            placeholder="50000"
            min="0"
            step="1"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {stages.map((stage) => (
                <option key={stage.Id} value={stage.name}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Win Probability
            </label>
            <select
              value={formData.probability}
              onChange={(e) => handleChange("probability", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="10">10% - Early stage</option>
              <option value="25">25% - Qualified lead</option>
              <option value="50">50% - Proposal sent</option>
              <option value="75">75% - Negotiating</option>
              <option value="90">90% - Verbal agreement</option>
            </select>
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
              {isSubmitting ? "Saving..." : deal ? "Update Deal" : "Add Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealModal;