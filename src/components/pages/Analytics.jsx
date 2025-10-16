import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ContactModal from "@/components/organisms/ContactModal";
import DealModal from "@/components/organisms/DealModal";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { pipelineService } from "@/services/api/pipelineService";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "react-toastify";

const Analytics = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData, stagesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        pipelineService.getStages()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setStages(stagesData);
    } catch (err) {
      setError("Failed to load analytics data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateMetrics = () => {
    const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const activeDeals = deals.filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage));
    const wonDeals = deals.filter(deal => deal.stage === "Closed Won");
    const lostDeals = deals.filter(deal => deal.stage === "Closed Lost");
    
    const winRate = deals.length > 0 ? ((wonDeals.length / deals.length) * 100) : 0;
    const avgDealSize = deals.length > 0 ? totalPipelineValue / deals.length : 0;
    const totalWonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    
    const stageMetrics = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage.name);
      const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      return {
        stage: stage.name,
        count: stageDeals.length,
        value: stageValue,
        color: stage.color
      };
    });

    return {
      totalPipelineValue,
      activeDeals: activeDeals.length,
      totalContacts: contacts.length,
      winRate,
      avgDealSize,
      totalWonValue,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
      stageMetrics
    };
  };

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [...prev, newContact]);
      toast.success("Contact added successfully");
      setContactModalOpen(false);
    } catch (error) {
      toast.error("Failed to add contact");
      console.error("Error adding contact:", error);
    }
  };

  const handleAddDeal = async (dealData) => {
    try {
      const newDeal = await dealService.create(dealData);
      setDeals(prev => [...prev, newDeal]);
      toast.success("Deal added successfully");
      setDealModalOpen(false);
    } catch (error) {
      toast.error("Failed to add deal");
      console.error("Error adding deal:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          title="Analytics" 
          onAddContact={() => setContactModalOpen(true)}
          onAddDeal={() => setDealModalOpen(true)}
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
          title="Analytics" 
          onAddContact={() => setContactModalOpen(true)}
          onAddDeal={() => setDealModalOpen(true)}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title="Analytics" 
        onAddContact={() => setContactModalOpen(true)}
        onAddDeal={() => setDealModalOpen(true)}
      />
      
      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Pipeline Value"
              value={formatCurrency(metrics.totalPipelineValue)}
              icon="DollarSign"
              trend={metrics.totalPipelineValue > 0 ? "up" : null}
              trendValue={`${deals.length} deals`}
            />
            <StatCard
              title="Active Deals"
              value={metrics.activeDeals}
              icon="TrendingUp"
              trend={metrics.activeDeals > 0 ? "up" : null}
              trendValue="in pipeline"
            />
            <StatCard
              title="Win Rate"
              value={`${metrics.winRate.toFixed(1)}%`}
              icon="Target"
              trend={metrics.winRate > 50 ? "up" : metrics.winRate > 0 ? "down" : null}
              trendValue={`${metrics.wonDeals} won, ${metrics.lostDeals} lost`}
            />
            <StatCard
              title="Average Deal Size"
              value={formatCurrency(metrics.avgDealSize)}
              icon="BarChart3"
              trend={metrics.avgDealSize > 0 ? "up" : null}
              trendValue="per deal"
            />
          </div>
        </div>

        {/* Revenue Metrics */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Revenue Closed"
              value={formatCurrency(metrics.totalWonValue)}
              icon="CheckCircle"
              trend="up"
              trendValue={`${metrics.wonDeals} deals won`}
            />
            <StatCard
              title="Total Contacts"
              value={metrics.totalContacts}
              icon="Users"
              trend={metrics.totalContacts > 0 ? "up" : null}
              trendValue="in database"
            />
            <StatCard
              title="Conversion Rate"
              value={`${metrics.totalContacts > 0 ? ((deals.length / metrics.totalContacts) * 100).toFixed(1) : 0}%`}
              icon="Percent"
              trend={deals.length > 0 ? "up" : null}
              trendValue="contacts to deals"
            />
          </div>
        </div>

        {/* Pipeline by Stage */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Pipeline by Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.stageMetrics.map((stage, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-medium text-slate-900">{stage.stage}</h3>
                  </div>
                  <ApperIcon name="MoreVertical" className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(stage.value)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {stage.count} deal{stage.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        {deals.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Pipeline Health</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Deals</span>
                    <span className="font-medium">{deals.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Active Pipeline</span>
                    <span className="font-medium">{formatCurrency(metrics.totalPipelineValue - metrics.totalWonValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Revenue Generated</span>
                    <span className="font-medium text-success-600">{formatCurrency(metrics.totalWonValue)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Key Insights</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• Win rate of {metrics.winRate.toFixed(1)}% indicates {metrics.winRate > 50 ? "strong" : "room for improvement in"} sales performance</p>
                  <p>• Average deal size of {formatCurrency(metrics.avgDealSize)} shows deal value trends</p>
                  <p>• {metrics.activeDeals} active deals representing {formatCurrency(metrics.totalPipelineValue - metrics.totalWonValue)} in potential revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSave={handleAddContact}
        title="Add Contact"
      />

      <DealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSave={handleAddDeal}
        contacts={contacts}
        stages={stages}
        title="Add Deal"
      />
    </div>
  );
};

export default Analytics;