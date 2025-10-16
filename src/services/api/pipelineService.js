import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = "pipeline_stage_c";

export const pipelineService = {
  async getStages() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "color_c" } }
        ],
        orderBy: [{ fieldName: "order_c", sorttype: "ASC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(stage => ({
        Id: stage.Id,
        name: stage.name_c,
        order: stage.order_c,
        color: stage.color_c
      }));
    } catch (error) {
      console.error("Error fetching pipeline stages:", error?.response?.data?.message || error);
      return [];
    }
  }
};