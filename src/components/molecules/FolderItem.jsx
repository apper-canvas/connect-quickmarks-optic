import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const FolderItem = ({ 
  folder, 
  isActive, 
  onClick, 
  level = 0,
  hasChildren = false,
  isExpanded = false,
  onToggleExpand
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(folder);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleExpand(folder.Id);
  };

  return (
    <div
      className={cn(
        "flex items-center w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-200 cursor-pointer group",
        level > 0 && "ml-4",
        isActive 
          ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md" 
          : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:scale-[1.02]"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasChildren && (
        <button
          onClick={handleToggle}
          className={cn(
            "mr-2 p-0.5 rounded transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        >
          <ApperIcon 
            name="ChevronRight" 
            size={14} 
            className={isActive ? "text-white" : "text-gray-500"} 
          />
        </button>
      )}
      
      {!hasChildren && level > 0 && <div className="w-5 mr-2" />}
      
      <div
        className="w-3 h-3 rounded-sm mr-3 shadow-sm"
        style={{ backgroundColor: folder.color }}
      />
      
      <span className="flex-1 font-medium truncate">
        {folder.name}
      </span>
      
      {folder.bookmarkCount > 0 && (
        <Badge
          variant={isActive ? "secondary" : "outline"}
          className={cn(
            "ml-2 text-xs",
            isActive 
              ? "bg-white/20 text-white border-white/30" 
              : "bg-gray-100 text-gray-600 border-gray-300"
          )}
        >
          {folder.bookmarkCount}
        </Badge>
      )}
    </div>
  );
};

export default FolderItem;