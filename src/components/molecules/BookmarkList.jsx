import BookmarkCard from "./BookmarkCard";
import { cn } from "@/utils/cn";

const BookmarkList = ({ 
  bookmarks, 
  view = "grid", 
  onEdit, 
  onDelete, 
  onOpen,
  selectedItems = [],
  onItemSelect,
  selectionMode = false,
  className 
}) => {
  const isSelected = (id) => selectedItems.includes(id);

  if (view === "list") {
    return (
      <div className={cn("space-y-2", className)}>
        {bookmarks.map((bookmark) => (
          <div key={bookmark.Id} className="w-full">
            <BookmarkCard
              bookmark={bookmark}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpen={onOpen}
              isSelected={isSelected(bookmark.Id)}
              onSelect={onItemSelect}
              selectionMode={selectionMode}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.Id}
          bookmark={bookmark}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpen={onOpen}
          isSelected={isSelected(bookmark.Id)}
          onSelect={onItemSelect}
          selectionMode={selectionMode}
        />
      ))}
    </div>
  );
};

export default BookmarkList;