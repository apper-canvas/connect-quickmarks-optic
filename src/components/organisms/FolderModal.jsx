import { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import folderService from "@/services/api/folderService";

const FolderModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  folder = null 
}) => {
  const [formData, setFormData] = useState({
name_c: "",
    color_c: "#2563eb",
    parent_folder_c: null
  });
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const colorOptions = [
    { value: "#2563eb", label: "Blue" },
    { value: "#059669", label: "Green" },
    { value: "#dc2626", label: "Red" },
    { value: "#f59e0b", label: "Yellow" },
    { value: "#7c3aed", label: "Purple" },
    { value: "#0284c7", label: "Cyan" },
    { value: "#64748b", label: "Gray" },
    { value: "#ec4899", label: "Pink" }
  ];

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      if (folder) {
setFormData({
          name_c: folder.name_c || "",
          color_c: folder.color_c || "#2563eb",
          parent_folder_c: folder.parent_folder_c?.Id || folder.parent_folder_c || null
        });
      } else {
        setFormData({
          name: "",
          color: "#2563eb",
          parentId: null
        });
      }
    }
  }, [isOpen, folder]);

  const loadFolders = async () => {
    try {
      const data = await folderService.getAll();
      // Filter out the current folder and its descendants to prevent circular references
const availableFolders = folder 
        ? data.filter(f => f.Id !== folder.Id && (f.parent_folder_c?.Id || f.parent_folder_c) !== folder.Id)
        : data;
      setFolders(availableFolders);
    } catch (error) {
      console.error("Failed to load folders:", error);
    }
  };

  const getAllFolderOptions = (folders) => {
    const options = [];
    const renderLevel = (parentId = null, level = 0) => {
folders
        .filter(f => (f.parent_folder_c?.Id || f.parent_folder_c) === parentId)
        .forEach(folder => {
          options.push(
            <option key={folder.Id} value={folder.Id}>
              {"  ".repeat(level)} {folder.name_c}
            </option>
          );
          renderLevel(folder.Id, level + 1);
        });
    };
    renderLevel();
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save folder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={folder ? "Edit Folder" : "Create Folder"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Folder Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter folder name"
            className="w-full"
            required
          />
        </div>

        {/* Parent Folder */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Parent Folder
          </label>
          <select
value={formData.parent_folder_c || ""}
            onChange={(e) => setFormData({ 
              ...formData, 
              parent_folder_c: e.target.value ? parseInt(e.target.value) : null 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white"
          >
            <option value="">Root (No parent)</option>
            {getAllFolderOptions(folders)}
          </select>
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: color.value })}
                className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  formData.color === color.value 
                    ? "border-gray-900 scale-105 shadow-lg" 
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              >
                {formData.color === color.value && (
                  <ApperIcon name="Check" size={16} className="text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="flex items-center space-x-2"
          >
            {isLoading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
            <span>{folder ? "Update" : "Create"} Folder</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FolderModal;