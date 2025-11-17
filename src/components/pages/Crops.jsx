import React, { useEffect, useState } from "react";
import { differenceInDays, format } from "date-fns";
import { toast } from "react-toastify";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Modal from "@/components/organisms/Modal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [formData, setFormData] = useState({
    farmId_c: "",
    cropType_c: "",
    fieldLocation_c: "",
    plantingDate_c: "",
    expectedHarvestDate_c: "",
    status_c: "Planted",
    notes_c: ""
  });
  const statusOptions = [
    { value: "Planted", label: "Planted" },
    { value: "Growing", label: "Growing" },
    { value: "Flowering", label: "Flowering" },
    { value: "Mature", label: "Mature" },
    { value: "Harvested", label: "Harvested" }
  ];

  const cropTypes = [
    { value: "Corn", label: "Corn" },
    { value: "Wheat", label: "Wheat" },
    { value: "Soybeans", label: "Soybeans" },
    { value: "Tomatoes", label: "Tomatoes" },
    { value: "Potatoes", label: "Potatoes" },
    { value: "Rice", label: "Rice" },
    { value: "Cotton", label: "Cotton" },
    { value: "Barley", label: "Barley" }
  ];

  const loadData = async () => {
    try {
      setError("");
setLoading(true);
      
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops data");
      console.error("Crops loading error:", err);
    } finally {
      setLoading(false);
    }
  };

const resetForm = () => {
    setFormData({
      farmId_c: "",
      cropType_c: "",
      fieldLocation_c: "",
      plantingDate_c: "",
      expectedHarvestDate_c: "",
      status_c: "Planted",
      notes_c: ""
    });
    setEditingCrop(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

const handleEdit = (crop) => {
    setFormData({
      farmId_c: crop.farmId_c?.Id || crop.farmId_c,
      cropType_c: crop.cropType_c,
      fieldLocation_c: crop.fieldLocation_c,
      plantingDate_c: format(new Date(crop.plantingDate_c), "yyyy-MM-dd"),
      expectedHarvestDate_c: format(new Date(crop.expectedHarvestDate_c), "yyyy-MM-dd"),
      status_c: crop.status_c,
      notes_c: crop.notes_c || ""
    });
    setEditingCrop(crop);
    setShowModal(true);
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) {
      return;
    }

    try {
      await cropService.delete(cropId);
      toast.success("Crop deleted successfully!");
      await loadData();
    } catch (err) {
      toast.error("Failed to delete crop");
      console.error("Crop deletion error:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId_c || !formData.cropType_c || !formData.fieldLocation_c || 
        !formData.plantingDate_c || !formData.expectedHarvestDate_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
try {
      const cropData = {
        ...formData,
        plantingDate_c: new Date(formData.plantingDate_c).toISOString(),
        expectedHarvestDate_c: new Date(formData.expectedHarvestDate_c).toISOString()
      };
      if (editingCrop) {
        await cropService.update(editingCrop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create(cropData);
        toast.success("Crop created successfully!");
      }

      handleClose();
      await loadData();
    } catch (error) {
      toast.error("Failed to save crop");
      console.error("Crop save error:", error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Planted": return "default";
      case "Growing": return "primary";
      case "Flowering": return "secondary";
      case "Mature": return "warning";
      case "Harvested": return "success";
      default: return "default";
    }
  };

  const getDaysToHarvest = (harvestDate) => {
    return differenceInDays(new Date(harvestDate), new Date());
  };

const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId || f.Id === parseInt(farmId));
    return farm ? (farm.name_c || farm.name) : "Unknown Farm";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
        <Button onClick={handleAdd} icon="Plus">
          Add New Crop
        </Button>
      </div>

      {crops.length === 0 ? (
        <Empty
          title="No crops yet"
          description="Start managing your crops by adding a new crop"
          icon="Sprout"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => {
            const daysToHarvest = getDaysToHarvest(crop.expectedHarvestDate_c);
return (
              <div key={crop.Id} className="card hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">{crop.cropType_c}</h3>
                    <p className="text-sm text-gray-600">{getFarmName(crop.farmId_c?.Id || crop.farmId_c)}</p>
                  </div>
                  <Badge variant={getStatusColor(crop.status_c)}>
                    {crop.status_c}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Field Location</p>
                    <p className="text-sm text-gray-600">{crop.fieldLocation_c}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Planting Date</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(crop.plantingDate_c), "MMM dd")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expected Harvest</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(crop.expectedHarvestDate_c), "MMM dd")}
                      </p>
                    </div>
                  </div>

                  {crop.status_c !== "Harvested" && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">
                        {daysToHarvest > 0 ? `${daysToHarvest} days until harvest` : "Ready to harvest"}
                      </p>
                    </div>
                  )}

                  {crop.notes_c && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="text-sm text-gray-600">{crop.notes_c}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(crop)}
                      className="flex-1"
                      icon="Edit2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(crop.Id)}
                      className="flex-1 text-error hover:bg-error/10 hover:text-error"
                      icon="Trash2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingCrop ? "Edit Crop" : "Add New Crop"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="Crop Type"
              name="cropType_c"
              type="select"
              value={formData.cropType_c}
              onChange={handleInputChange}
              options={cropTypes}
              placeholder="Select crop type"
              required
            />
          </div>

          <FormField
            label="Field Location"
            name="fieldLocation_c"
            type="text"
            value={formData.fieldLocation_c}
            onChange={handleInputChange}
            placeholder="e.g., North Field, Greenhouse A"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Planting Date"
              name="plantingDate_c"
              type="date"
              value={formData.plantingDate_c}
              onChange={handleInputChange}
              required
            />

            <FormField
              label="Expected Harvest Date"
              name="expectedHarvestDate_c"
              type="date"
              value={formData.expectedHarvestDate_c}
              onChange={handleInputChange}
              required
            />
          </div>

          <FormField
            label="Status"
            name="status_c"
            type="select"
            value={formData.status_c}
            onChange={handleInputChange}
            options={statusOptions}
            required
          />

          <FormField
            label="Notes"
            name="notes_c"
            type="textarea"
            value={formData.notes_c}
            onChange={handleInputChange}
            placeholder="Optional notes about this crop"
          />
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
              {isSubmitting ? "Saving..." : (editingCrop ? "Update Crop" : "Create Crop")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Crops;