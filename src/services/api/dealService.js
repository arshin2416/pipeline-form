import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

const TABLE_NAME = "deal_c";

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expected_close_date_c" } },
          { field: { Name: "moved_to_stage_at_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
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

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        probability: deal.probability_c,
        expectedCloseDate: deal.expected_close_date_c,
        movedToStageAt: deal.moved_to_stage_at_c,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        createdAt: deal.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expected_close_date_c" } },
          { field: { Name: "moved_to_stage_at_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);

      if (!response?.data) {
        return null;
      }

      const deal = response.data;
      return {
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        probability: deal.probability_c,
        expectedCloseDate: deal.expected_close_date_c,
        movedToStageAt: deal.moved_to_stage_at_c,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        createdAt: deal.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            title_c: dealData.title,
            value_c: parseFloat(dealData.value),
            stage_c: dealData.stage,
            probability_c: parseInt(dealData.probability),
            contact_id_c: parseInt(dealData.contactId),
            expected_close_date_c: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            moved_to_stage_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} deals:`, failed);
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            title: created.title_c,
            value: created.value_c,
            stage: created.stage_c,
            probability: created.probability_c,
            expectedCloseDate: created.expected_close_date_c,
            movedToStageAt: created.moved_to_stage_at_c,
            contactId: created.contact_id_c?.Id || created.contact_id_c,
            createdAt: created.CreatedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const updateFields = {
        Id: id
      };

      if (dealData.title !== undefined) updateFields.title_c = dealData.title;
      if (dealData.value !== undefined) updateFields.value_c = parseFloat(dealData.value);
      if (dealData.stage !== undefined) {
        updateFields.stage_c = dealData.stage;
        updateFields.moved_to_stage_at_c = new Date().toISOString();
      }
      if (dealData.probability !== undefined) updateFields.probability_c = parseInt(dealData.probability);
      if (dealData.contactId !== undefined) updateFields.contact_id_c = parseInt(dealData.contactId);

      const params = {
        records: [updateFields]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c,
            value: updated.value_c,
            stage: updated.stage_c,
            probability: updated.probability_c,
            expectedCloseDate: updated.expected_close_date_c,
            movedToStageAt: updated.moved_to_stage_at_c,
            contactId: updated.contact_id_c?.Id || updated.contact_id_c,
            createdAt: updated.CreatedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
  },

  async moveToStage(id, newStage) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            Id: id,
            stage_c: newStage,
            moved_to_stage_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to move ${failed.length} deals:`, failed);
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c,
            value: updated.value_c,
            stage: updated.stage_c,
            probability: updated.probability_c,
            expectedCloseDate: updated.expected_close_date_c,
            movedToStageAt: updated.moved_to_stage_at_c,
            contactId: updated.contact_id_c?.Id || updated.contact_id_c,
            createdAt: updated.CreatedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error moving deal to stage:", error?.response?.data?.message || error);
throw error;
    }
  }
};