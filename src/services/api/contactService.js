import { getApperClient } from "@/services/apperClient";
const { ApperFileUploader } = window.ApperSDK;

const TABLE_NAME = "contact_c";


export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "last_contact_date_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "files_1_c" } },
          { field: { Name: "files_3_c" } },
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

      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.name_c,
        email: contact.email_c,
        phone: contact.phone_c,
        company: contact.company_c,
        notes: contact.notes_c,
        lastContactDate: contact.last_contact_date_c,
        createdAt: contact.CreatedOn,
        files_1_c: contact.files_1_c || [],
        files_3_c: contact.files_3_c || []
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
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
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "last_contact_date_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "files_1_c" } },
          { field: { Name: "files_3_c" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);

      if (!response?.data) {
        return null;
      }

      const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.name_c,
        email: contact.email_c,
        phone: contact.phone_c,
        company: contact.company_c,
        notes: contact.notes_c,
        lastContactDate: contact.last_contact_date_c,
        createdAt: contact.CreatedOn,
        files_1_c: contact.files_1_c || [],
        files_3_c: contact.files_3_c || []
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [
          {
            name_c: contactData.name,
            email_c: contactData.email,
            phone_c: contactData.phone || "",
            company_c: contactData.company,
            notes_c: contactData.notes || "",
            last_contact_date_c: new Date().toISOString(),
            files_1_c: ApperFileUploader.toCreateFormat(contactData.files_1_c),
            files_3_c: ApperFileUploader.toCreateFormat(contactData.files_3_c)
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
          console.error(`Failed to create ${failed.length} contacts:`, failed);
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.name_c,
            email: created.email_c,
            phone: created.phone_c,
            company: created.company_c,
            notes: created.notes_c,
            lastContactDate: created.last_contact_date_c,
            createdAt: created.CreatedOn,
            files_1_c: created.files_1_c || [],
            files_3_c: created.files_3_c || []
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const updateFields = {
        Id: id
      };

      if (contactData.name !== undefined) updateFields.name_c = contactData.name;
      if (contactData.email !== undefined) updateFields.email_c = contactData.email;
      if (contactData.phone !== undefined) updateFields.phone_c = contactData.phone;
      if (contactData.company !== undefined) updateFields.company_c = contactData.company;
      if (contactData.notes !== undefined) updateFields.notes_c = contactData.notes;
      if (contactData.files_1_c !== undefined) updateFields.files_1_c = ApperFileUploader.toUpdateFormat(contactData.files_1_c);
      if (contactData.files_3_c !== undefined) updateFields.files_3_c = ApperFileUploader.toUpdateFormat(contactData.files_3_c);

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
          console.error(`Failed to update ${failed.length} contacts:`, failed);
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.name_c,
            email: updated.email_c,
            phone: updated.phone_c,
            company: updated.company_c,
            notes: updated.notes_c,
            lastContactDate: updated.last_contact_date_c,
            createdAt: updated.CreatedOn,
            files_1_c: updated.files_1_c || [],
            files_3_c: updated.files_3_c || []
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      return false;
}
  }
};