import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(350);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    return deal ? { ...deal } : null;
  },

  async create(dealData) {
    await delay(450);
    const maxId = deals.length > 0 ? Math.max(...deals.map(d => d.Id)) : 0;
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      movedToStageAt: new Date().toISOString(),
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(400);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) return null;
    
    const currentStage = deals[index].stage;
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      movedToStageAt: dealData.stage && dealData.stage !== currentStage 
        ? new Date().toISOString() 
        : deals[index].movedToStageAt
    };
    
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) return false;
    
    deals.splice(index, 1);
    return true;
  },

  async moveToStage(id, newStage) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) return null;
    
    deals[index] = {
      ...deals[index],
      stage: newStage,
      movedToStageAt: new Date().toISOString()
    };
    return { ...deals[index] };
  }
};