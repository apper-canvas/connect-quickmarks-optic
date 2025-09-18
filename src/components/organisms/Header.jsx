import { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ViewToggle from "@/components/molecules/ViewToggle";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ 
  onSearch, 
  onAddBookmark, 
  view, 
  onViewChange,
  selectedCount = 0,
  onBulkDelete,
  onClearSelection,
  selectionMode = false,
  onToggleMobile
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Logo and Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMobile}
              className="lg:hidden h-10 w-10"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bookmark" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                QuickMarks
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search bookmarks, folders, or tags..."
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {selectionMode && selectedCount > 0 ? (
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-primary">
                  {selectedCount} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBulkDelete}
                  className="text-error hover:text-error hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            ) : (
              <>
                <ViewToggle view={view} onViewChange={onViewChange} />
                
                <Button
                  onClick={onAddBookmark}
                  className="flex items-center space-x-2"
                  size="md"
                >
                  <ApperIcon name="Plus" size={16} />
                  <span className="hidden sm:inline">Add Bookmark</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;