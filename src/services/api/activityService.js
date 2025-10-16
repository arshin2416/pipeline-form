import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = "activity_c";

export const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "deal_id_c" } },
          { field: { Name: "CreatedBy" } }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        createdBy: activity.CreatedBy?.Name || "System"
      }));
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "deal_id_c" } },
          { field: { Name: "CreatedBy" } }
        ],
        where: [
          {
            FieldName: "contact_id_c",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        createdBy: activity.CreatedBy?.Name || "System"
      }));
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "deal_id_c" } },
          { field: { Name: "CreatedBy" } }
        ],
        where: [
          {
            FieldName: "deal_id_c",
            Operator: "EqualTo",
            Values: [parseInt(dealId)]
          }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        createdBy: activity.CreatedBy?.Name || "System"
      }));
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            type_c: activityData.type,
            description_c: activityData.description,
            timestamp_c: new Date().toISOString(),
            contact_id_c: activityData.contactId ? parseInt(activityData.contactId) : null,
            deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null
          }
        ]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            type: created.type_c,
            description: created.description_c,
            timestamp: created.timestamp_c,
            contactId: created.contact_id_c?.Id || created.contact_id_c,
            dealId: created.deal_id_c?.Id || created.deal_id_c,
            createdBy: created.CreatedBy?.Name || "System"
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }
};