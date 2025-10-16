import React from "react";
import ContactRow from "@/components/molecules/ContactRow";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const ContactTable = ({ 
  contacts, 
  deals,
  loading = false, 
  selectedContact, 
  onSelectContact, 
  onEditContact, 
  onDeleteContact,
  onAddContact 
}) => {
  const getContactDealCount = (contactId) => {
    return deals.filter(deal => deal.contactId === contactId).length;
  };

  if (loading) {
    return <Loading type="cards" className="p-6" />;
  }

  if (contacts.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No contacts yet"
        description="Start building your network by adding your first contact"
        actionLabel="Add Contact"
        onAction={onAddContact}
        className="py-16"
      />
    );
  }

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Deals
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Last Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {contacts.map((contact) => (
              <ContactRow
                key={contact.Id}
                contact={contact}
                dealCount={getContactDealCount(contact.Id)}
                onSelect={onSelectContact}
                onEdit={onEditContact}
                onDelete={onDeleteContact}
                isSelected={selectedContact?.Id === contact.Id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;