import { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import folderService from "@/services/api/folderService";
import { cn } from "@/utils/cn";

const BookmarkModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  bookmark = null,
  defaultFolderId = null
}) => {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    folderId: null,
    tags: []
  });
  const [folders, setFolders] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      if (bookmark) {
        setFormData({
          url: bookmark.url || "",
          title: bookmark.title || "",
          description: bookmark.description || "",
          folderId: bookmark.folderId || null,
          tags: bookmark.tags || []
        });
      } else {
        setFormData({
          url: "",
          title: "",
          description: "",
          folderId: defaultFolderId,
          tags: []
        });
      }
      setUrlError("");
    }
  }, [isOpen, bookmark, defaultFolderId]);

  const loadFolders = async () => {
    try {
      const data = await folderService.getAll();
      setFolders(data);
    } catch (error) {
      console.error("Failed to load folders:", error);
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, url });
    
    if (url && !validateUrl(url)) {
      setUrlError("Please enter a valid URL");
    } else {
      setUrlError("");
    }

    // Auto-fetch title if URL is valid
    if (validateUrl(url) && !formData.title) {
      fetchTitleFromUrl(url);
    }
  };

  const fetchTitleFromUrl = async (url) => {
    try {
      // In a real app, this would make an API call to fetch the page title
      // For now, we'll extract from URL
      const domain = new URL(url).hostname.replace("www.", "");
      const title = domain.charAt(0).toUpperCase() + domain.slice(1);
      setFormData(prev => ({ ...prev, title }));
    } catch (error) {
      console.error("Failed to fetch title:", error);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url || !validateUrl(formData.url)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    if (!formData.title.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFolderOptions = (folders, parentId = null, level = 0) => {
    return folders
      .filter(f => f.parentId === parentId)
      .map(folder => (
        <option key={folder.Id} value={folder.Id}>
          {"  ".repeat(level)} {folder.name}
        </option>
      ));
  };

  const getAllFolderOptions = (folders) => {
    const options = [];
    const renderLevel = (parentId = null, level = 0) => {
      folders
        .filter(f => f.parentId === parentId)
        .forEach(folder => {
          options.push(
            <option key={folder.Id} value={folder.Id}>
              {"  ".repeat(level)} {folder.name}
            </option>
          );
          renderLevel(folder.Id, level + 1);
        });
    };
    renderLevel();
    return options;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bookmark ? "Edit Bookmark" : "Add Bookmark"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* URL Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            URL *
          </label>
          <Input
            type="url"
            value={formData.url}
            onChange={handleUrlChange}
            placeholder="https://example.com"
            className={cn(
              "w-full",
              urlError && "border-error focus:border-error focus:ring-error"
            )}
            required
          />
          {urlError && (
            <p className="text-sm text-error">{urlError}</p>
          )}
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Bookmark title"
            className="w-full"
            required
          />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none transition-colors"
          />
        </div>

        {/* Folder Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Folder
          </label>
          <select
            value={formData.folderId || ""}
            onChange={(e) => setFormData({ 
              ...formData, 
              folderId: e.target.value ? parseInt(e.target.value) : null 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white"
          >
            <option value="">No folder</option>
            {getAllFolderOptions(folders)}
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          
          {/* Add Tag Input */}
          <div className="flex space-x-2">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag(e);
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              disabled={!tagInput.trim()}
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>

          {/* Tag List */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center space-x-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700 ml-1"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
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
            disabled={isLoading || !formData.url || !formData.title.trim() || !!urlError}
            className="flex items-center space-x-2"
          >
            {isLoading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
            <span>{bookmark ? "Update" : "Add"} Bookmark</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookmarkModal;