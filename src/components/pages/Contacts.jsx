import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { pipelineService } from "@/services/api/pipelineService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import DealModal from "@/components/organisms/DealModal";
import Header from "@/components/organisms/Header";
import ContactModal from "@/components/organisms/ContactModal";
import ContactTable from "@/components/organisms/ContactTable";
import ContactDetail from "@/components/organisms/ContactDetail";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  
  // Selection and modal states
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactDetailOpen, setContactDetailOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [contactsData, dealsData, activitiesData, stagesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
        pipelineService.getStages()
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
      setStages(stagesData);
    } catch (err) {
      setError("Failed to load contacts data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchValue.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setContactDetailOpen(true);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactModalOpen(true);
    setContactDetailOpen(false);
  };

const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
        const updatedContact = await contactService.update(editingContact.Id, contactData);
        if (updatedContact) {
          setContacts(prev => prev.map(c => c.Id === editingContact.Id ? updatedContact : c));
          if (selectedContact?.Id === editingContact.Id) {
            setSelectedContact(updatedContact);
          }
          toast.success("Contact updated successfully");
        }
      } else {
        const newContact = await contactService.create(contactData);
        if (newContact) {
          setContacts(prev => [...prev, newContact]);
          toast.success("Contact added successfully");
          
          await activityService.create({
            contactId: newContact.Id,
            dealId: null,
            type: "contact_created",
            description: `New contact "${newContact.name}" was added`
          });
        }
      }
      setContactModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      toast.error("Failed to save contact");
      console.error("Error saving contact:", error);
    }
  };

  const handleUpdateContact = async (contactId, contactData) => {
    try {
      const updatedContact = await contactService.update(contactId, contactData);
      if (updatedContact) {
        setContacts(prev => prev.map(c => c.Id === contactId ? updatedContact : c));
        if (selectedContact?.Id === contactId) {
          setSelectedContact(updatedContact);
        }
        toast.success("Contact updated successfully");
        
        // Log activity
        await activityService.create({
          contactId: updatedContact.Id,
          dealId: null,
          type: "contact_updated",
          description: `Contact "${updatedContact.name}" was updated`
        });
      }
    } catch (error) {
      toast.error("Failed to update contact");
      console.error("Error updating contact:", error);
      throw error; // Re-throw so the row can handle the error state
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact? This will also delete all associated deals.")) return;
    
    try {
      // Delete associated deals first
      const contactDeals = deals.filter(deal => deal.contactId === contactId);
      for (const deal of contactDeals) {
        await dealService.delete(deal.Id);
      }
      
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(c => c.Id !== contactId));
      setDeals(prev => prev.filter(d => d.contactId !== contactId));
      
      if (selectedContact?.Id === contactId) {
        setSelectedContact(null);
        setContactDetailOpen(false);
      }
      
      toast.success("Contact deleted successfully");
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error("Error deleting contact:", error);
    }
  };

  const handleAddDeal = () => {
    setDealModalOpen(true);
  };

const handleSaveDeal = async (dealData) => {
    try {
      const newDeal = await dealService.create(dealData);
      if (newDeal) {
        setDeals(prev => [...prev, newDeal]);
        toast.success("Deal added successfully");
        
        // Log activity
        await activityService.create({
          contactId: newDeal.contactId,
          dealId: newDeal.Id,
          type: "deal_created",
          description: `New deal "${newDeal.title}" was created`
        });
      }
      
      setDealModalOpen(false);
    } catch (error) {
      toast.error("Failed to save deal");
      console.error("Error saving deal:", error);
    }
  };

  const handleCloseDetail = () => {
    setContactDetailOpen(false);
    setSelectedContact(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          title="Contacts" 
          showSearch={true}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onAddContact={handleAddContact}
          onAddDeal={handleAddDeal}
        />
        <div className="p-6">
          <Loading type="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          title="Contacts" 
          showSearch={true}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onAddContact={handleAddContact}
          onAddDeal={handleAddDeal}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title="Contacts" 
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onAddContact={handleAddContact}
        onAddDeal={handleAddDeal}
      />
      
      <div className="p-6">
        <ContactTable
          contacts={filteredContacts}
          deals={deals}
          onSelectContact={handleSelectContact}
          onEditContact={handleEditContact}
          onDeleteContact={handleDeleteContact}
          onUpdateContact={handleUpdateContact}
          selectedContact={selectedContact}
        />

        <ContactDetail
          isOpen={contactDetailOpen}
          contact={selectedContact}
          deals={deals}
          activities={activities}
          onClose={handleCloseDetail}
          onEdit={handleEditContact}
        />

        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => {
            setContactModalOpen(false);
            setEditingContact(null);
          }}
          onSave={handleSaveContact}
          contact={editingContact}
          title={editingContact ? "Edit Contact" : "Add Contact"}
        />

        <DealModal
          isOpen={dealModalOpen}
          onClose={() => setDealModalOpen(false)}
          onSubmit={handleSaveDeal}
          deal={null}
          contacts={contacts}
          stages={stages}
          title="Add Deal"
        />
      </div>
    </div>
  );
};

export default Contacts;