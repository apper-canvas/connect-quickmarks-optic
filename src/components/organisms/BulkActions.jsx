import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BulkActions = ({ 
  selectedCount, 
  onBulkDelete, 
  onClearSelection,
  onBulkMove,
  className 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm",
      className
    )}>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-900">
          {selectedCount} bookmark{selectedCount !== 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBulkMove}
          className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
        >
          <ApperIcon name="FolderOpen" size={16} className="mr-2" />
          Move
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onBulkDelete}
          className="text-error hover:text-error hover:bg-red-50"
        >
          <ApperIcon name="Trash2" size={16} className="mr-2" />
          Delete
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
    </div>
  );
};

export default BulkActions;