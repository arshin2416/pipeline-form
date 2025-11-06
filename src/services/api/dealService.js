import { toast } from 'react-toastify';
import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = "deal_c";

export const dealService = {
  async getAll() {
    try {
      const apperClient = await getApperClient();
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

// Check if apperClient is properly initialized
      if (!apperClient || typeof apperClient.fetchRecords !== 'function') {
        console.error('ApperClient not properly initialized or SDK not loaded');
        return {
          success: false,
          message: 'Data service not available. Please refresh the page.',
          data: []
        };
      }

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error("Failed to fetch deals:", response.message);
        toast.error(response.message || "Failed to load deals");
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
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      toast.error("Failed to load deals");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      if (!id || isNaN(parseInt(id))) {
        console.error("Invalid deal ID provided:", id);
        return null;
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

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

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
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to load deal");
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = await getApperClient();
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
        console.error("Failed to create deal:", response.message);
        toast.error(response.message || "Failed to create deal");
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create deal:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("Deal created successfully");
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
      console.error("Error creating deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to create deal");
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = await getApperClient();
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
        console.error(`Failed to update deal ${id}:`, response.message);
        toast.error(response.message || "Failed to update deal");
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update deal ${id}:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("Deal updated successfully");
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
      console.error(`Error updating deal ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to update deal");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(`Failed to delete deal ${id}:`, response.message);
        toast.error(response.message || "Failed to delete deal");
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete deal ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        if (successful.length > 0) {
          toast.success("Deal deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting deal ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to delete deal");
      return false;
    }
  },

  async moveToStage(id, newStage) {
    try {
      const apperClient = await getApperClient();
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
        console.error(`Failed to move deal to stage:`, response.message);
        toast.error(response.message || "Failed to move deal");
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to move ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success("Deal moved successfully");
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
      console.error("Error moving deal to stage:", error?.response?.data?.message || error.message);
      toast.error("Failed to move deal");
      return null;
    }
  }
};

export default dealService;