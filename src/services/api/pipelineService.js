import stagesData from "@/services/mockData/pipelineStages.json";

let stages = [...stagesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const pipelineService = {
  async getStages() {
    await delay(200);
    return [...stages].sort((a, b) => a.order - b.order);
  }
};