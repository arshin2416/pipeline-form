import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(250);
    return [...activities];
  },

  async getByContactId(contactId) {
    await delay(200);
    return activities.filter(a => a.contactId === parseInt(contactId));
  },

  async getByDealId(dealId) {
    await delay(200);
    return activities.filter(a => a.dealId === parseInt(dealId));
  },

  async create(activityData) {
    await delay(300);
    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0;
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString(),
      createdBy: "Current User"
    };
    activities.push(newActivity);
    return { ...newActivity };
  }
};