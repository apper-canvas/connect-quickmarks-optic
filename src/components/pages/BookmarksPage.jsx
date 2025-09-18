import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import BookmarkList from "@/components/molecules/BookmarkList";
import BookmarkModal from "@/components/organisms/BookmarkModal";
import FolderModal from "@/components/organisms/FolderModal";
import BulkActions from "@/components/organisms/BulkActions";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bookmarkService from "@/services/api/bookmarkService";
import folderService from "@/services/api/folderService";
import { toast } from "react-toastify";

const BookmarksPage = () => {
  // Data state
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [view, setView] = useState("grid");
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal state
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);

  // Selection state
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, [activeFolderId, searchQuery]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (searchQuery) {
        data = await bookmarkService.search(searchQuery);
      } else if (activeFolderId) {
        data = await bookmarkService.getByFolder(activeFolderId);
      } else {
        data = await bookmarkService.getAll();
      }

      setBookmarks(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveFolderId(null);
  };

  const handleFolderSelect = (folderId) => {
    setActiveFolderId(folderId);
    setSearchQuery("");
  };

  const handleAddBookmark = () => {
    setEditingBookmark(null);
    setIsBookmarkModalOpen(true);
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsBookmarkModalOpen(true);
  };

  const handleSaveBookmark = async (bookmarkData) => {
    try {
if (editingBookmark) {
        await bookmarkService.update(editingBookmark.Id, bookmarkData);
        toast.success("Bookmark updated successfully");
      } else {
        await bookmarkService.create(bookmarkData);
        toast.success("Bookmark added successfully");
      }
      loadBookmarks();
    } catch (err) {
      toast.error(editingBookmark ? "Failed to update bookmark" : "Failed to add bookmark");
      throw err;
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (confirm("Are you sure you want to delete this bookmark?")) {
      try {
        await bookmarkService.delete(bookmarkId);
        toast.success("Bookmark deleted successfully");
        loadBookmarks();
      } catch (err) {
        toast.error("Failed to delete bookmark");
      }
    }
  };

  const handleOpenBookmark = async (bookmark) => {
    try {
await bookmarkService.incrementAccessCount(bookmark.Id);
      window.open(bookmark.url_c, '_blank');
      window.open(bookmark.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to update access count:", err);
      window.open(bookmark.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleAddFolder = () => {
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = async (folderData) => {
    try {
      await folderService.create(folderData);
      toast.success("Folder created successfully");
    } catch (err) {
      toast.error("Failed to create folder");
      throw err;
    }
  };

  // Selection handlers
  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        const newSelection = prev.filter(id => id !== itemId);
        if (newSelection.length === 0) {
          setSelectionMode(false);
        }
        return newSelection;
      } else {
        setSelectionMode(true);
        return [...prev, itemId];
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    const count = selectedItems.length;
    if (confirm(`Are you sure you want to delete ${count} bookmark${count !== 1 ? 's' : ''}?`)) {
      try {
        await bookmarkService.bulkDelete(selectedItems);
        toast.success(`${count} bookmark${count !== 1 ? 's' : ''} deleted successfully`);
        setSelectedItems([]);
        setSelectionMode(false);
        loadBookmarks();
      } catch (err) {
        toast.error("Failed to delete bookmarks");
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setSelectionMode(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex">
          <Sidebar 
            activeFolderId={activeFolderId}
            onFolderSelect={handleFolderSelect}
            onAddFolder={handleAddFolder}
          />
          <div className="flex-1">
            <Header 
              onSearch={handleSearch}
              onAddBookmark={handleAddBookmark}
              view={view}
              onViewChange={setView}
              onToggleMobile={toggleMobileSidebar}
            />
            <main className="p-6">
              <Loading />
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex">
          <Sidebar 
            activeFolderId={activeFolderId}
            onFolderSelect={handleFolderSelect}
            onAddFolder={handleAddFolder}
          />
          <div className="flex-1">
            <Header 
              onSearch={handleSearch}
              onAddBookmark={handleAddBookmark}
              view={view}
              onViewChange={setView}
              onToggleMobile={toggleMobileSidebar}
            />
            <main className="p-6">
              <Error message={error} onRetry={loadBookmarks} />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeFolderId={activeFolderId}
          onFolderSelect={handleFolderSelect}
          onAddFolder={handleAddFolder}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Header 
            onSearch={handleSearch}
            onAddBookmark={handleAddBookmark}
            view={view}
            onViewChange={setView}
            selectedCount={selectedItems.length}
            onBulkDelete={handleBulkDelete}
            onClearSelection={handleClearSelection}
            selectionMode={selectionMode}
            onToggleMobile={toggleMobileSidebar}
          />

          <main className="p-6">
            {/* Bulk Actions */}
            {selectionMode && (
              <BulkActions
                selectedCount={selectedItems.length}
                onBulkDelete={handleBulkDelete}
                onClearSelection={handleClearSelection}
                className="mb-6"
              />
            )}

            {/* Content */}
            {bookmarks.length === 0 ? (
              <Empty
                title={searchQuery ? "No bookmarks found" : "No bookmarks yet"}
                message={
                  searchQuery 
                    ? `No bookmarks found matching "${searchQuery}"`
                    : "Start building your bookmark collection by adding your first link"
                }
                actionLabel="Add Bookmark"
                onAction={handleAddBookmark}
              />
            ) : (
              <BookmarkList
                bookmarks={bookmarks}
                view={view}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteBookmark}
                onOpen={handleOpenBookmark}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                selectionMode={selectionMode}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onSave={handleSaveBookmark}
        bookmark={editingBookmark}
        defaultFolderId={activeFolderId}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSave={handleSaveFolder}
      />
    </div>
  );
};

export default BookmarksPage;