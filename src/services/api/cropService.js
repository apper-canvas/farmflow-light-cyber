import { getApperClient } from "@/services/apperClient";

const cropService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("crops_c", {
        fields: [
          { field: { Name: "farmId_c" } },
          { field: { Name: "cropType_c" } },
          { field: { Name: "fieldLocation_c" } },
          { field: { Name: "plantingDate_c" } },
          { field: { Name: "expectedHarvestDate_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching crops:", response?.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in cropService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.getRecordById("crops_c", parseInt(id), {
        fields: [
          { field: { Name: "farmId_c" } },
          { field: { Name: "cropType_c" } },
          { field: { Name: "fieldLocation_c" } },
          { field: { Name: "plantingDate_c" } },
          { field: { Name: "expectedHarvestDate_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching crop:", response?.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error("Error in cropService.getById:", error);
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("crops_c", {
        fields: [
          { field: { Name: "farmId_c" } },
          { field: { Name: "cropType_c" } },
          { field: { Name: "fieldLocation_c" } },
          { field: { Name: "plantingDate_c" } },
          { field: { Name: "expectedHarvestDate_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [{
          FieldName: "farmId_c",
          Operator: "EqualTo",
          Values: [parseInt(farmId)]
        }]
      });
      
      if (!response?.success) {
        console.error("Error fetching crops by farm:", response?.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in cropService.getByFarmId:", error);
      return [];
    }
  },

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          farmId_c: cropData.farmId_c ? parseInt(cropData.farmId_c) : (cropData.farmId ? parseInt(cropData.farmId) : null),
          cropType_c: cropData.cropType_c || cropData.cropType,
          fieldLocation_c: cropData.fieldLocation_c || cropData.fieldLocation,
          plantingDate_c: cropData.plantingDate_c || cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate_c || cropData.expectedHarvestDate,
          status_c: cropData.status_c || cropData.status,
          notes_c: cropData.notes_c || cropData.notes
        }]
      };
      
      const response = await apperClient.createRecord("crops_c", payload);
      
      if (!response?.success) {
        console.error("Error creating crop:", response?.message);
        throw new Error(response?.message || "Failed to create crop");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to create crop");
    } catch (error) {
      console.error("Error in cropService.create:", error);
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          Id: parseInt(id),
          farmId_c: cropData.farmId_c ? parseInt(cropData.farmId_c) : (cropData.farmId ? parseInt(cropData.farmId) : null),
          cropType_c: cropData.cropType_c || cropData.cropType,
          fieldLocation_c: cropData.fieldLocation_c || cropData.fieldLocation,
          plantingDate_c: cropData.plantingDate_c || cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate_c || cropData.expectedHarvestDate,
          status_c: cropData.status_c || cropData.status,
          notes_c: cropData.notes_c || cropData.notes
        }]
      };
      
      const response = await apperClient.updateRecord("crops_c", payload);
      
      if (!response?.success) {
        console.error("Error updating crop:", response?.message);
        throw new Error(response?.message || "Failed to update crop");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to update crop");
    } catch (error) {
      console.error("Error in cropService.update:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.deleteRecord("crops_c", {
        RecordIds: [parseInt(id)]
      });
      
      if (!response?.success) {
        console.error("Error deleting crop:", response?.message);
        throw new Error(response?.message || "Failed to delete crop");
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error in cropService.delete:", error);
      throw error;
    }
  }
};

export default cropService;