import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { pipelineService } from "@/services/api/pipelineService";
import { activityService } from "@/services/api/activityService";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import DealModal from "@/components/organisms/DealModal";
import Header from "@/components/organisms/Header";
import ContactModal from "@/components/organisms/ContactModal";
import PipelineBoard from "@/components/organisms/PipelineBoard";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
const [dealsData, contactsData, stagesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        pipelineService.getStages()
      ]);
      
      if (!dealsData || !contactsData || !stagesData) {
        setError("Failed to load initial data");
        return;
      }
      setDeals(dealsData);
      setContacts(contactsData);
      setStages(stagesData);
    } catch (err) {
      setError("Failed to load pipeline data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddContact = () => {
    setEditingContact(null);
    setContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactModalOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
const updatedContact = await contactService.update(editingContact.Id, contactData);
        if (updatedContact) {
          setContacts(prev => prev.map(c => c.Id === editingContact.Id ? updatedContact : c));
        }
        toast.success("Contact updated successfully");
      } else {
        const newContact = await contactService.create(contactData);
        setContacts(prev => [...prev, newContact]);
        toast.success("Contact added successfully");
      }
      setContactModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      toast.error("Failed to save contact");
      console.error("Error saving contact:", error);
    }
  };

  const handleAddDeal = () => {
    setEditingDeal(null);
    setDealModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setDealModalOpen(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
const updatedDeal = await dealService.update(editingDeal.Id, dealData);
        if (updatedDeal) {
          setDeals(prev => prev.map(d => d.Id === editingDeal.Id ? updatedDeal : d));
          toast.success("Deal updated successfully");
          
          await activityService.create({
            contactId: updatedDeal.contactId,
            dealId: updatedDeal.Id,
            type: "deal_updated",
            description: `Deal "${updatedDeal.title}" was updated`
          });
        }
      } else {
        const newDeal = await dealService.create(dealData);
        if (newDeal) {
          setDeals(prev => [...prev, newDeal]);
          toast.success("Deal added successfully");
await activityService.create({
            contactId: newDeal.contactId,
            dealId: newDeal.Id,
            type: "deal_created",
            description: `New deal "${newDeal.title}" was created`
          });
        }
      }
      setDealModalOpen(false);
      setEditingDeal(null);
    } catch (error) {
      toast.error("Failed to save deal");
      console.error("Error saving deal:", error);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;
    
    try {
      await dealService.delete(dealId);
      setDeals(prev => prev.filter(d => d.Id !== dealId));
      toast.success("Deal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete deal");
      console.error("Error deleting deal:", error);
    }
  };

  const handleMoveDeal = async (dealId, newStage) => {
    try {
const updatedDeal = await dealService.moveToStage(dealId, newStage);
      if (updatedDeal) {
        setDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d));
        toast.success(`Deal moved to ${newStage}`);
        
        await activityService.create({
          contactId: updatedDeal.contactId,
          dealId: updatedDeal.Id,
          type: "deal_updated",
          description: `Deal moved to ${newStage} stage`
        });
      }
    } catch (error) {
      toast.error("Failed to move deal");
      console.error("Error moving deal:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Pipeline" onAddContact={handleAddContact} onAddDeal={handleAddDeal} />
        <Loading type="cards" className="p-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Pipeline" onAddContact={handleAddContact} onAddDeal={handleAddDeal} />
        <Error message={error} onRetry={loadData} className="p-6" />
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Pipeline" onAddContact={handleAddContact} onAddDeal={handleAddDeal} />
        <Empty
          icon="TrendingUp"
          title="No deals in your pipeline"
          description="Start tracking your sales opportunities by adding your first deal"
          actionLabel="Add First Deal"
          onAction={handleAddDeal}
className="p-16"
        />
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          onSave={handleSaveContact}
          contact={editingContact}
          title={editingContact ? "Edit Contact" : "Add Contact"}
        />
        <DealModal
          isOpen={dealModalOpen}
          onClose={() => setDealModalOpen(false)}
          onSave={handleSaveDeal}
          deal={editingDeal}
          contacts={contacts}
          stages={stages}
          title={editingDeal ? "Edit Deal" : "Add Deal"}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Pipeline" onAddContact={handleAddContact} onAddDeal={handleAddDeal} />
      <PipelineBoard
        deals={deals}
        stages={stages}
        contacts={contacts}
        onEditDeal={handleEditDeal}
        onDeleteDeal={handleDeleteDeal}
        onMoveDeal={handleMoveDeal}
      />
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
        title={editingContact ? "Edit Contact" : "Add Contact"}
      />
      <DealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSave={handleSaveDeal}
        deal={editingDeal}
        contacts={contacts}
        stages={stages}
        title={editingDeal ? "Edit Deal" : "Add Deal"}
      />
    </div>
  );
};

export default Pipeline;