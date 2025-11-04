import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const TABLE_NAME = "deal_c";

// Deal Service - Complete CRUD operations for deal management
export const dealService = {
  // Get all deals with proper field selection and error handling
  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "pipeline_id_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_date_c"}},
          {"field": {"Name": "modified_date_c"}}
        ],
        orderBy: [{"fieldName": "modified_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

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

if (!response.success) {
        console.error("Failed to fetch deals:", response.message);
        toast.error(response.message || "Failed to load deals");
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      toast.error("Failed to load deals");
      return [];
    }
  },

  // Get deal by ID with proper validation
  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      if (!id || isNaN(parseInt(id))) {
        console.error("Invalid deal ID provided:", id);
        return null;
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "close_date_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "pipeline_id_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_date_c"}},
          {"field": {"Name": "modified_date_c"}}
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

      if (!response.success) {
        console.error(`Failed to fetch deal ${id}:`, response.message);
        toast.error(response.message || "Failed to load deal");
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to load deal");
      return null;
    }
  },

  // Create new deal with field visibility compliance
  async create(data) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Only include Updateable fields in create operation
      const dealData = {
        Name: data.Name || "",
        amount_c: data.amount_c ? parseFloat(data.amount_c) : 0,
        stage_c: data.stage_c || "Lead",
        close_date_c: data.close_date_c || new Date().toISOString().split('T')[0],
        contact_id_c: data.contact_id_c ? parseInt(data.contact_id_c) : null,
        pipeline_id_c: data.pipeline_id_c ? parseInt(data.pipeline_id_c) : null,
        probability_c: data.probability_c ? parseFloat(data.probability_c) : 0,
        description_c: data.description_c || ""
      };

      // Remove null/undefined values
      Object.keys(dealData).forEach(key => {
        if (dealData[key] === null || dealData[key] === undefined || dealData[key] === "") {
          delete dealData[key];
        }
      });

      const params = {
        records: [dealData]
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
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to create deal");
      return null;
    }
  },

  // Update existing deal with field validation
  async update(id, data) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      if (!id || isNaN(parseInt(id))) {
        console.error("Invalid deal ID for update:", id);
        toast.error("Invalid deal ID");
        return null;
      }

      // Only include Updateable fields in update operation
      const dealData = {
        Id: parseInt(id)
      };

      // Add only fields that have values and are updateable
      if (data.Name !== undefined) dealData.Name = data.Name;
      if (data.amount_c !== undefined) dealData.amount_c = parseFloat(data.amount_c);
      if (data.stage_c !== undefined) dealData.stage_c = data.stage_c;
      if (data.close_date_c !== undefined) dealData.close_date_c = data.close_date_c;
      if (data.contact_id_c !== undefined) dealData.contact_id_c = parseInt(data.contact_id_c);
      if (data.pipeline_id_c !== undefined) dealData.pipeline_id_c = parseInt(data.pipeline_id_c);
      if (data.probability_c !== undefined) dealData.probability_c = parseFloat(data.probability_c);
      if (data.description_c !== undefined) dealData.description_c = data.description_c;

      const params = {
        records: [dealData]
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
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating deal ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to update deal");
      return null;
    }
  },

  // Delete deal with confirmation
  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      if (!id || isNaN(parseInt(id))) {
        console.error("Invalid deal ID for deletion:", id);
        toast.error("Invalid deal ID");
        return false;
      }

      const params = {
        RecordIds: [parseInt(id)]
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
  }
};

export default dealService;
      
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