import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";

const BookmarkCard = ({ 
  bookmark, 
  onEdit, 
  onDelete, 
  onOpen,
  isSelected = false,
  onSelect,
  selectionMode = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    onOpen(bookmark);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(bookmark);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
onDelete(bookmark.Id);
  };

  const handleSelect = (e) => {
    if (selectionMode) {
      e.stopPropagation();
onSelect(bookmark.Id);
    }
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50",
        isSelected && "ring-2 ring-primary bg-gradient-to-br from-blue-50 to-blue-100",
        selectionMode && "hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100"
      )}
      onClick={selectionMode ? handleSelect : handleOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {selectionMode && (
              <div className="flex-shrink-0">
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  isSelected 
                    ? "bg-primary border-primary" 
                    : "border-gray-300 bg-white hover:border-primary"
                )}>
                  {isSelected && (
                    <ApperIcon name="Check" size={12} className="text-white" />
                  )}
                </div>
              </div>
            )}
            
<div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
              {!imageError ? (
                <img
                  src={bookmark.favicon_c}
                  alt=""
                  className="w-5 h-5 rounded"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ApperIcon name="Globe" size={16} className="text-gray-500" />
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate text-sm leading-5 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {bookmark.title_c}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {getDomain(bookmark.url_c)}
              </p>
            </div>
          </div>
          
          {!selectionMode && isHovered && (
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200"
              >
                <ApperIcon name="Edit" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 text-gray-500 hover:text-error hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          )}
        </div>
        
{bookmark.description_c && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-5">
            {bookmark.description_c}
          </p>
        )}
        
{bookmark.tags_c && bookmark.tags_c.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.tags_c.split(',').slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
              >
                {tag.trim()}
              </Badge>
            ))}
            {bookmark.tags_c.split(',').length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{bookmark.tags_c.split(',').length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
<ApperIcon name="Eye" size={12} className="mr-1" />
              {bookmark.access_count_c || 0}
            </span>
            <span>
              {formatDistanceToNow(new Date(bookmark.last_accessed_c || bookmark.created_at_c), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookmarkCard;