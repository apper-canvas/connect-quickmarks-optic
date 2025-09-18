import foldersData from "../mockData/folders.json";

class FolderService {
  constructor() {
    this.folders = [...foldersData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.folders];
  }

  async getById(id) {
    await this.delay(200);
    const folder = this.folders.find(f => f.Id === parseInt(id));
    if (!folder) {
      throw new Error("Folder not found");
    }
    return { ...folder };
  }

  async getRootFolders() {
    await this.delay();
    return this.folders.filter(f => f.parentId === null).map(f => ({ ...f }));
  }

  async getSubfolders(parentId) {
    await this.delay();
    return this.folders.filter(f => f.parentId === parseInt(parentId)).map(f => ({ ...f }));
  }

  async create(folderData) {
    await this.delay(350);
    
    const maxId = Math.max(...this.folders.map(f => f.Id), 0);
    const newFolder = {
      Id: maxId + 1,
      name: folderData.name,
      parentId: folderData.parentId || null,
      color: folderData.color || "#64748b",
      createdAt: new Date().toISOString(),
      bookmarkCount: 0
    };

    this.folders.push(newFolder);
    return { ...newFolder };
  }

  async update(id, folderData) {
    await this.delay(300);
    
    const index = this.folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Folder not found");
    }

    this.folders[index] = {
      ...this.folders[index],
      ...folderData,
      Id: parseInt(id)
    };

    return { ...this.folders[index] };
  }

  async delete(id) {
    await this.delay(350);
    
    const index = this.folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Folder not found");
    }

    // Check if folder has subfolders
    const hasSubfolders = this.folders.some(f => f.parentId === parseInt(id));
    if (hasSubfolders) {
      throw new Error("Cannot delete folder with subfolders");
    }

    this.folders.splice(index, 1);
    return { success: true };
  }

  async updateBookmarkCount(id, count) {
    await this.delay(100);
    
    const folder = this.folders.find(f => f.Id === parseInt(id));
    if (folder) {
      folder.bookmarkCount = count;
    }
    
    return folder ? { ...folder } : null;
  }
}

export default new FolderService();