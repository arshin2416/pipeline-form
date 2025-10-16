import React from "react";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatDateRelative } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ContactRow = ({ 
  contact, 
  dealCount = 0, 
  onSelect, 
  onEdit, 
  onDelete,
  isSelected = false
}) => {
  return (
    <tr 
      className={cn(
        "hover:bg-slate-50 transition-colors cursor-pointer",
        isSelected && "bg-primary-50"
      )}
      onClick={() => onSelect(contact)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <Avatar name={contact.name} size="md" />
          <div>
            <div className="text-sm font-medium text-slate-900">{contact.name}</div>
            <div className="text-sm text-slate-500">{contact.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-900">{contact.company}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-900">{contact.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={dealCount > 0 ? "primary" : "default"}>
          {dealCount} deals
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {formatDateRelative(contact.lastContactDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contact);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact.Id);
            }}
            className="text-slate-400 hover:text-error-500"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ContactRow;