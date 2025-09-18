import bookmarksData from "../mockData/bookmarks.json";

class BookmarkService {
  constructor() {
    this.bookmarks = [...bookmarksData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.bookmarks];
  }

  async getById(id) {
    await this.delay(200);
    const bookmark = this.bookmarks.find(b => b.Id === parseInt(id));
    if (!bookmark) {
      throw new Error("Bookmark not found");
    }
    return { ...bookmark };
  }

  async getByFolder(folderId) {
    await this.delay();
    return this.bookmarks.filter(b => b.folderId === parseInt(folderId)).map(b => ({ ...b }));
  }

  async search(query) {
    await this.delay(250);
    if (!query || query.trim() === "") {
      return [...this.bookmarks];
    }

    const searchTerm = query.toLowerCase();
    return this.bookmarks
      .filter(bookmark => 
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description.toLowerCase().includes(searchTerm) ||
        bookmark.url.toLowerCase().includes(searchTerm) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .map(b => ({ ...b }));
  }

  async create(bookmarkData) {
    await this.delay(400);
    
    const maxId = Math.max(...this.bookmarks.map(b => b.Id), 0);
    const newBookmark = {
      Id: maxId + 1,
      url: bookmarkData.url,
      title: bookmarkData.title,
      description: bookmarkData.description || "",
      favicon: `${new URL(bookmarkData.url).origin}/favicon.ico`,
      folderId: bookmarkData.folderId || null,
      tags: bookmarkData.tags || [],
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      accessCount: 0
    };

    this.bookmarks.push(newBookmark);
    return { ...newBookmark };
  }

  async update(id, bookmarkData) {
    await this.delay(350);
    
    const index = this.bookmarks.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bookmark not found");
    }

    this.bookmarks[index] = {
      ...this.bookmarks[index],
      ...bookmarkData,
      Id: parseInt(id)
    };

    return { ...this.bookmarks[index] };
  }

  async delete(id) {
    await this.delay(300);
    
    const index = this.bookmarks.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bookmark not found");
    }

    this.bookmarks.splice(index, 1);
    return { success: true };
  }

  async bulkDelete(ids) {
    await this.delay(400);
    
    const intIds = ids.map(id => parseInt(id));
    this.bookmarks = this.bookmarks.filter(b => !intIds.includes(b.Id));
    return { success: true, deletedCount: intIds.length };
  }

  async incrementAccessCount(id) {
    await this.delay(100);
    
    const bookmark = this.bookmarks.find(b => b.Id === parseInt(id));
    if (bookmark) {
      bookmark.accessCount += 1;
      bookmark.lastAccessed = new Date().toISOString();
    }
    
    return bookmark ? { ...bookmark } : null;
  }

  async getRecent(limit = 10) {
    await this.delay(200);
    
    return this.bookmarks
      .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
      .slice(0, limit)
      .map(b => ({ ...b }));
  }

  async getPopular(limit = 10) {
    await this.delay(200);
    
    return this.bookmarks
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit)
      .map(b => ({ ...b }));
  }
}

export default new BookmarkService();