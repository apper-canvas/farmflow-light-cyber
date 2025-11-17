import { getApperClient } from "@/services/apperClient";

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("tasks_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "recurring_c" } },
          { field: { Name: "farmId_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching tasks:", response?.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in taskService.getAll:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.getRecordById("tasks_c", parseInt(id), {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "recurring_c" } },
          { field: { Name: "farmId_c" } }
        ]
      });
      
      if (!response?.success) {
        console.error("Error fetching task:", response?.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error("Error in taskService.getById:", error);
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.fetchRecords("tasks_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "recurring_c" } },
          { field: { Name: "farmId_c" } }
        ],
        where: [{
          FieldName: "farmId_c",
          Operator: "EqualTo",
          Values: [parseInt(farmId)]
        }]
      });
      
      if (!response?.success) {
        console.error("Error fetching tasks by farm:", response?.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error in taskService.getByFarmId:", error);
      return [];
    }
  },

  async getUpcoming() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const response = await apperClient.fetchRecords("tasks_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "recurring_c" } },
          { field: { Name: "farmId_c" } }
        ],
        where: [{
          FieldName: "completed_c",
          Operator: "EqualTo",
          Values: [false]
        }]
      });
      
      if (!response?.success) {
        console.error("Error fetching upcoming tasks:", response?.message);
        return [];
      }
      
      const filtered = (response.data || []).filter(task => {
        const dueDate = new Date(task.dueDate_c);
        return dueDate >= now && dueDate <= nextWeek;
      });
      
      return filtered.sort((a, b) => new Date(a.dueDate_c) - new Date(b.dueDate_c));
    } catch (error) {
      console.error("Error in taskService.getUpcoming:", error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          title_c: taskData.title_c || taskData.title,
          description_c: taskData.description_c || taskData.description,
          dueDate_c: taskData.dueDate_c || taskData.dueDate,
          priority_c: taskData.priority_c || taskData.priority,
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : false,
          recurring_c: taskData.recurring_c !== undefined ? taskData.recurring_c : false,
          farmId_c: taskData.farmId_c ? parseInt(taskData.farmId_c) : (taskData.farmId ? parseInt(taskData.farmId) : null)
        }]
      };
      
      const response = await apperClient.createRecord("tasks_c", payload);
      
      if (!response?.success) {
        console.error("Error creating task:", response?.message);
        throw new Error(response?.message || "Failed to create task");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to create task");
    } catch (error) {
      console.error("Error in taskService.create:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const payload = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title_c || taskData.title,
          description_c: taskData.description_c || taskData.description,
          dueDate_c: taskData.dueDate_c || taskData.dueDate,
          priority_c: taskData.priority_c || taskData.priority,
          completed_c: taskData.completed_c !== undefined ? taskData.completed_c : false,
          recurring_c: taskData.recurring_c !== undefined ? taskData.recurring_c : false,
          farmId_c: taskData.farmId_c ? parseInt(taskData.farmId_c) : (taskData.farmId ? parseInt(taskData.farmId) : null)
        }]
      };
      
      const response = await apperClient.updateRecord("tasks_c", payload);
      
      if (!response?.success) {
        console.error("Error updating task:", response?.message);
        throw new Error(response?.message || "Failed to update task");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to update task");
    } catch (error) {
      console.error("Error in taskService.update:", error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const task = await this.getById(id);
      if (!task) throw new Error("Task not found");
      
      const newCompletedState = !task.completed_c;
      
      const payload = {
        records: [{
          Id: parseInt(id),
          completed_c: newCompletedState
        }]
      };
      
      const response = await apperClient.updateRecord("tasks_c", payload);
      
      if (!response?.success) {
        console.error("Error toggling task complete:", response?.message);
        throw new Error(response?.message || "Failed to toggle task complete");
      }
      
      if (response.results?.[0]?.success) {
        return response.results[0].data;
      }
      
      throw new Error(response.results?.[0]?.message || "Failed to toggle task complete");
    } catch (error) {
      console.error("Error in taskService.toggleComplete:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");
      
      const response = await apperClient.deleteRecord("tasks_c", {
        RecordIds: [parseInt(id)]
      });
      
      if (!response?.success) {
        console.error("Error deleting task:", response?.message);
        throw new Error(response?.message || "Failed to delete task");
      }
      
      return { Id: parseInt(id) };
    } catch (error) {
      console.error("Error in taskService.delete:", error);
      throw error;
    }
  }
};

export default taskService;