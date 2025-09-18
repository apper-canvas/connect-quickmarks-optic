import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No bookmarks found", 
  message = "Start building your bookmark collection by adding your first link",
  actionLabel = "Add Bookmark",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-full mb-6">
        <ApperIcon name="Bookmark" className="w-12 h-12 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="flex items-center space-x-2"
          size="lg"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;