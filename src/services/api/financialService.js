import { getApperClient } from "@/services/apperClient";

const financialService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("financialEntries_c", {
        fields: [
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "farmId_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching financial entries:", response?.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in financialService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.getRecordById("financialEntries_c", parseInt(id), {
        fields: [
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "farmId_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching financial entry:", response?.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error("Error in financialService.getById:", error);
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("financialEntries_c", {
        fields: [
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "farmId_c" } }
        ],
        where: [{
          FieldName: "farmId_c",
          Operator: "EqualTo",
          Values: [parseInt(farmId)]
        }]
      });
      
      if (!response?.success) {
        console.error("Error fetching financial entries by farm:", response?.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in financialService.getByFarmId:", error);
      return [];
    }
  },

  async getSummary() {
    try {
      const entries = await this.getAll();
      
      const summary = entries.reduce((acc, entry) => {
        const amount = entry.amount_c || 0;
        if (entry.type_c === "income") {
          acc.totalIncome += amount;
        } else {
          acc.totalExpenses += amount;
        }
        return acc;
      }, { totalIncome: 0, totalExpenses: 0 });
      
      summary.netBalance = summary.totalIncome - summary.totalExpenses;
      return summary;
    } catch (error) {
      console.error("Error in financialService.getSummary:", error);
      return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    }
  },

  async create(entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          type_c: entryData.type_c || entryData.type,
          amount_c: parseFloat(entryData.amount_c || entryData.amount),
          category_c: entryData.category_c || entryData.category,
          description_c: entryData.description_c || entryData.description,
          date_c: entryData.date_c || entryData.date,
          farmId_c: entryData.farmId_c ? parseInt(entryData.farmId_c) : (entryData.farmId ? parseInt(entryData.farmId) : null)
        }]
      };
      
      const response = await apperClient.createRecord("financialEntries_c", payload);
      
      if (!response?.success) {
        console.error("Error creating financial entry:", response?.message);
        throw new Error(response?.message || "Failed to create financial entry");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to create financial entry");
    } catch (error) {
      console.error("Error in financialService.create:", error);
      throw error;
    }
  },

  async update(id, entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          Id: parseInt(id),
          type_c: entryData.type_c || entryData.type,
          amount_c: parseFloat(entryData.amount_c || entryData.amount),
          category_c: entryData.category_c || entryData.category,
          description_c: entryData.description_c || entryData.description,
          date_c: entryData.date_c || entryData.date,
          farmId_c: entryData.farmId_c ? parseInt(entryData.farmId_c) : (entryData.farmId ? parseInt(entryData.farmId) : null)
        }]
      };
      
      const response = await apperClient.updateRecord("financialEntries_c", payload);
      
      if (!response?.success) {
        console.error("Error updating financial entry:", response?.message);
        throw new Error(response?.message || "Failed to update financial entry");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to update financial entry");
    } catch (error) {
      console.error("Error in financialService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.deleteRecord("financialEntries_c", {
        RecordIds: [parseInt(id)]
      });
      
      if (!response?.success) {
        console.error("Error deleting financial entry:", response?.message);
        throw new Error(response?.message || "Failed to delete financial entry");
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error in financialService.delete:", error);
      throw error;
    }
  }
};

export default financialService;