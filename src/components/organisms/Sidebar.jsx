import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FolderItem from "@/components/molecules/FolderItem";
import ApperIcon from "@/components/ApperIcon";
import folderService from "@/services/api/folderService";
import { cn } from "@/utils/cn";

const Sidebar = ({ 
  activeFolderId, 
  onFolderSelect, 
  onAddFolder,
  isMobileOpen = false,
  onCloseMobile,
  className 
}) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const data = await folderService.getAll();
      setFolders(data);
    } catch (error) {
      console.error("Failed to load folders:", error);
    } finally {
      setLoading(false);
    }
  };

const handleFolderSelect = (folder) => {
    onFolderSelect(folder?.Id || null);
    onCloseMobile?.();
  };

  const handleToggleExpand = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (folders, parentId = null, level = 0) => {
    const filteredFolders = folders.filter(f => f.parentId === parentId);
    
    return filteredFolders.map(folder => {
const hasChildren = folders.some(f => (f.parent_folder_c?.Id || f.parent_folder_c) === folder.Id);
      const isExpanded = expandedFolders.has(folder.Id);
      
      return (
        <div key={folder.Id}>
          <FolderItem
            folder={folder}
            isActive={activeFolderId === folder.Id}
            onClick={handleFolderSelect}
            level={level}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggleExpand={handleToggleExpand}
          />
          {hasChildren && isExpanded && (
            <div className="ml-2">
{renderFolderTree(folders, folder.Id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Mobile Overlay
  if (isMobileOpen) {
    return (
      <>
        {/* Mobile Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
        
        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 lg:hidden",
          "translate-x-0"
        )}>
          <SidebarContent 
            folders={folders}
            loading={loading}
            activeFolderId={activeFolderId}
            handleFolderSelect={handleFolderSelect}
            renderFolderTree={renderFolderTree}
            onAddFolder={onAddFolder}
            onCloseMobile={onCloseMobile}
            isMobile={true}
          />
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className={cn("hidden lg:flex lg:w-80 lg:flex-col bg-white border-r border-gray-200", className)}>
      <SidebarContent 
        folders={folders}
        loading={loading}
        activeFolderId={activeFolderId}
        handleFolderSelect={handleFolderSelect}
        renderFolderTree={renderFolderTree}
        onAddFolder={onAddFolder}
        isMobile={false}
      />
    </div>
  );
};

const SidebarContent = ({ 
  folders, 
  loading, 
  activeFolderId, 
  handleFolderSelect, 
  renderFolderTree, 
  onAddFolder,
  onCloseMobile,
  isMobile 
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Folders
          </h2>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              className="h-8 w-8"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* All Bookmarks */}
        <div 
          className={cn(
            "flex items-center w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-200 cursor-pointer",
            activeFolderId === null
              ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:scale-[1.02]"
          )}
          onClick={() => handleFolderSelect(null)}
        >
          <ApperIcon 
            name="Bookmark" 
            size={16} 
            className={cn(
              "mr-3",
              activeFolderId === null ? "text-white" : "text-primary"
            )} 
          />
          <span className="font-medium">All Bookmarks</span>
        </div>

        {/* Recent */}
        <div 
          className="flex items-center w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-200 cursor-pointer text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:scale-[1.02]"
          onClick={() => {/* Handle recent view */}}
        >
          <ApperIcon name="Clock" size={16} className="mr-3 text-gray-500" />
          <span className="font-medium">Recent</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3" />

        {/* Folder Tree */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center px-3 py-2">
                <div className="w-3 h-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-sm mr-3 animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {renderFolderTree(folders)}
          </div>
        )}
      </div>

      {/* Add Folder Button */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <Button
          onClick={onAddFolder}
          variant="outline"
          className="w-full flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Folder</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;