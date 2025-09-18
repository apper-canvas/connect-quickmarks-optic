import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading bookmarks..." }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded"></div>
        <div className="flex-1">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <ApperIcon 
            name="Loader2" 
            className="w-6 h-6 text-primary animate-spin" 
          />
          <span className="text-lg font-medium text-gray-700 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {message}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default Loading;