import React, { useState } from "react";
import FarmList from "@/components/organisms/FarmList";
import Modal from "@/components/organisms/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";

const Farms = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
name_c: "",
    location_c: "",
    size_c: "",
    sizeUnit_c: "acres"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeUnitOptions = [
    { value: "acres", label: "Acres" },
    { value: "hectares", label: "Hectares" },
    { value: "square feet", label: "Square Feet" },
    { value: "square meters", label: "Square Meters" }
  ];

  const resetForm = () => {
    setFormData({
name_c: "",
      location_c: "",
      size_c: "",
      sizeUnit_c: "acres"
    });
    setEditingFarm(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (farm) => {
    setFormData({
name_c: farm.name_c,
      location_c: farm.location_c,
      size_c: farm.size_c.toString(),
      sizeUnit_c: farm.sizeUnit_c
    });
    setEditingFarm(farm);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'size' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.name_c.trim() || !formData.location_c.trim() || !formData.size_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const farmData = {
...formData,
        size_c: typeof formData.size_c === 'string' ? parseFloat(formData.size_c) : formData.size_c
      };

      if (editingFarm) {
        await farmService.update(editingFarm.Id, farmData);
        toast.success("Farm updated successfully!");
      } else {
        await farmService.create(farmData);
        toast.success("Farm created successfully!");
      }
handleClose();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to save farm");
      console.error("Farm save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
<FarmList onEdit={handleEdit} onAdd={handleAdd} refreshKey={refreshKey} />

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingFarm ? "Edit Farm" : "Add New Farm"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Farm Name"
name="name_c"
            value={formData.name_c}
            onChange={handleInputChange}
            placeholder="Enter farm name"
            required
          />

          <FormField
            label="Location"
name="location_c"
            value={formData.location_c}
            onChange={handleInputChange}
            placeholder="Enter farm location"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Size"
name="size_c"
              type="number"
              value={formData.size_c}
              onChange={handleInputChange}
              placeholder="0"
              required
            />

            <FormField
label="Unit"
              name="sizeUnit_c"
              type="select"
              value={formData.sizeUnit_c}
              onChange={handleInputChange}
              options={sizeUnitOptions}
              required
            />
          </div>

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
              {isSubmitting ? "Saving..." : (editingFarm ? "Update Farm" : "Create Farm")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Farms;