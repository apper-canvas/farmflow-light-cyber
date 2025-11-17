import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import farmService from "@/services/api/farmService";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Modal from "@/components/organisms/Modal";
import Button from "@/components/atoms/Button";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [formData, setFormData] = useState({
    farmId_c: "",
    title_c: "",
    description_c: "",
    dueDate_c: "",
    priority_c: "medium",
    recurring_c: false
  });
  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  const statusFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ];

  const priorityFilterOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [tasksData, farmsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll()
      ]);

      // Sort tasks by due date
      const sortedTasks = tasksData.sort((a, b) => new Date(a.dueDate_c) - new Date(b.dueDate_c));
      
      setTasks(sortedTasks);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load tasks data");
      console.error("Tasks loading error:", err);
    } finally {
      setLoading(false);
    }
  };

// Filter tasks based on search and filters
  useEffect(() => {
    let filtered = tasks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => {
        if (statusFilter === "pending") return !task.completed_c;
        if (statusFilter === "completed") return task.completed_c;
        return true;
      });
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority_c === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

const resetForm = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    setFormData({
      farmId_c: "",
      title_c: "",
      description_c: "",
      dueDate_c: tomorrow.toISOString().slice(0, 16),
      priority_c: "medium",
      recurring_c: false
    });
    setEditingTask(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

const handleEdit = (task) => {
    setFormData({
      farmId_c: task.farmId_c?.Id || task.farmId_c,
      title_c: task.title_c,
      description_c: task.description_c,
      dueDate_c: new Date(task.dueDate_c).toISOString().slice(0, 16),
      priority_c: task.priority_c,
      recurring_c: task.recurring_c
    });
    setEditingTask(task);
    setShowModal(true);
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      toast.success("Task updated successfully!");
      await loadData();
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Task toggle error:", err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      toast.success("Task deleted successfully!");
      await loadData();
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Task deletion error:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId_c || !formData.title_c || !formData.description_c || !formData.dueDate_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate_c: new Date(formData.dueDate_c).toISOString()
      };
      
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully!");
      }

      handleClose();
      await loadData();
    } catch (error) {
      toast.error("Failed to save task");
      console.error("Task save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadData} />;
  }

const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId || f.Id === parseInt(farmId));
    return farm ? (farm.name_c || farm.name) : "Unknown Farm";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <Button onClick={handleAdd} icon="Plus">
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Status"
              name="statusFilter"
              type="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusFilterOptions}
            />
            
            <FormField
              label="Priority"
              name="priorityFilter"
              type="select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityFilterOptions}
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={tasks.length === 0 ? 
            "Start by adding your first task to keep track of your farm activities." : 
            "No tasks match your current filters. Try adjusting your search or filter criteria."
          }
          actionLabel="Add Task"
          onAction={handleAdd}
          icon="CheckSquare"
        />
) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.Id}
              task={{...task, title: task.title_c, description: task.description_c, dueDate: task.dueDate_c, priority: task.priority_c, completed: task.completed_c, recurring: task.recurring_c, farmId: task.farmId_c}}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Farm"
            name="farmId_c"
            type="select"
            value={formData.farmId_c}
            onChange={handleInputChange}
            options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name_c || farm.name }))}
            required
          />

          <FormField
            label="Task Title"
            name="title_c"
            type="text"
            value={formData.title_c}
            onChange={handleInputChange}
            placeholder="e.g., Water North Field, Harvest Wheat"
            required
          />

          <FormField
            label="Description"
            name="description_c"
            type="textarea"
            value={formData.description_c}
            onChange={handleInputChange}
            placeholder="Detailed description of the task"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Due Date & Time"
              name="dueDate_c"
              type="datetime-local"
              value={formData.dueDate_c}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Priority"
              name="priority_c"
              type="select"
              value={formData.priority_c}
              onChange={handleInputChange}
              options={[
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" }
              ]}
            />
          </div>

          <FormField
            label="Recurring Task"
            name="recurring_c"
            type="checkbox"
            checked={formData.recurring_c}
            onChange={handleInputChange}
          />
<div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (editingTask ? "Update Task" : "Create Task")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;