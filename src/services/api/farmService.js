import { getApperClient } from "@/services/apperClient";

const farmService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("farms_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "sizeUnit_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching farms:", response?.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in farmService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.getRecordById("farms_c", parseInt(id), {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "sizeUnit_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching farm:", response?.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error("Error in farmService.getById:", error);
      return null;
    }
  },

  async create(farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          name_c: farmData.name_c || farmData.name,
          location_c: farmData.location_c || farmData.location,
          size_c: farmData.size_c ? parseInt(farmData.size_c) : parseInt(farmData.size),
          sizeUnit_c: farmData.sizeUnit_c || farmData.sizeUnit
        }]
      };
      
      const response = await apperClient.createRecord("farms_c", payload);
      
      if (!response?.success) {
        console.error("Error creating farm:", response?.message);
        throw new Error(response?.message || "Failed to create farm");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to create farm");
    } catch (error) {
      console.error("Error in farmService.create:", error);
      throw error;
    }
  },

  async update(id, farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: farmData.name_c || farmData.name,
          location_c: farmData.location_c || farmData.location,
          size_c: farmData.size_c ? parseInt(farmData.size_c) : parseInt(farmData.size),
          sizeUnit_c: farmData.sizeUnit_c || farmData.sizeUnit
        }]
      };
      
      const response = await apperClient.updateRecord("farms_c", payload);
      
      if (!response?.success) {
        console.error("Error updating farm:", response?.message);
        throw new Error(response?.message || "Failed to update farm");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to update farm");
    } catch (error) {
      console.error("Error in farmService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.deleteRecord("farms_c", {
        RecordIds: [parseInt(id)]
      });
      
      if (!response?.success) {
        console.error("Error deleting farm:", response?.message);
        throw new Error(response?.message || "Failed to delete farm");
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error in farmService.delete:", error);
      throw error;
    }
  }
};

export default farmService;