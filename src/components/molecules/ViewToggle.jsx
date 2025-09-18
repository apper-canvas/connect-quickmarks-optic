import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ViewToggle = ({ view, onViewChange, className }) => {
  return (
    <div className={cn("flex rounded-lg border border-gray-300 overflow-hidden", className)}>
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className={cn(
          "rounded-none border-0 h-10 px-3",
          view === "grid" 
            ? "bg-gradient-to-r from-primary to-blue-600 text-white" 
            : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
        )}
      >
        <ApperIcon name="Grid3x3" size={16} />
      </Button>
      
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className={cn(
          "rounded-none border-0 border-l border-gray-300 h-10 px-3",
          view === "list" 
            ? "bg-gradient-to-r from-primary to-blue-600 text-white" 
            : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
        )}
      >
        <ApperIcon name="List" size={16} />
      </Button>
    </div>
  );
};

export default ViewToggle;