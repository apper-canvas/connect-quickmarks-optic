class BookmarkService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'bookmark_c';
  }

  async getAll() {
    try {
const params = {
        fields: [
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "folder_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_accessed_c"}},
          {"field": {"Name": "access_count_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
pagingInfo: {"limit": 100, "offset": 0},
        where: [{"FieldName": "Owner", "Operator": "EqualTo", "Values": [store.getState().user.user?.userId]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching bookmarks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
const params = {
        fields: [
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "folder_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_accessed_c"}},
          {"field": {"Name": "access_count_c"}}
        ],
        where: [{"FieldName": "Owner", "Operator": "EqualTo", "Values": [store.getState().user.user?.userId]}]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bookmark ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByFolder(folderId) {
    try {
const params = {
        fields: [
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "folder_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_accessed_c"}},
          {"field": {"Name": "access_count_c"}}
        ],
        where: [
          {"FieldName": "folder_c", "Operator": "EqualTo", "Values": [parseInt(folderId)]},
          {"FieldName": "Owner", "Operator": "EqualTo", "Values": [store.getState().user.user?.userId]}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching bookmarks by folder:", error?.response?.data?.message || error);
      return [];
    }
  }

  async search(query) {
    try {
      if (!query || query.trim() === "") {
        return this.getAll();
      }

const params = {
        fields: [
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "folder_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_accessed_c"}},
          {"field": {"Name": "access_count_c"}}
        ],
        where: [{"FieldName": "Owner", "Operator": "EqualTo", "Values": [store.getState().user.user?.userId]}],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "Owner", "operator": "EqualTo", "values": [store.getState().user.user?.userId]}
              ],
              "operator": ""
            },
            {
              "operator": "OR",
              "subGroups": [
                {"conditions": [{"fieldName": "title_c", "operator": "Contains", "values": [query]}], "operator": "OR"},
                {"conditions": [{"fieldName": "description_c", "operator": "Contains", "values": [query]}], "operator": "OR"},
                {"conditions": [{"fieldName": "url_c", "operator": "Contains", "values": [query]}], "operator": "OR"},
                {"conditions": [{"fieldName": "tags_c", "operator": "Contains", "values": [query]}], "operator": "OR"}
              ]
            }
          ]
        }],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching bookmarks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(bookmarkData) {
    try {
// Generate favicon URL if not provided
      const favicon = bookmarkData.favicon_c || `${new URL(bookmarkData.url_c).origin}/favicon.ico`;
      
      const params = {
        records: [{
          url_c: bookmarkData.url_c,
          title_c: bookmarkData.title_c,
          description_c: bookmarkData.description_c || "",
          favicon_c: favicon,
          icon_c: bookmarkData.icon_c || "",
          folder_c: bookmarkData.folder_c ? parseInt(bookmarkData.folder_c) : null,
          tags_c: bookmarkData.tags_c || "",
          access_count_c: 0
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bookmarks:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating bookmark:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, bookmarkData) {
    try {
const params = {
        records: [{
          Id: parseInt(id),
          url_c: bookmarkData.url_c,
          title_c: bookmarkData.title_c,
          description_c: bookmarkData.description_c || "",
          icon_c: bookmarkData.icon_c || "",
          folder_c: bookmarkData.folder_c ? parseInt(bookmarkData.folder_c) : null,
          tags_c: bookmarkData.tags_c || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bookmarks:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating bookmark:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bookmarks:`, failed);
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting bookmark:", error?.response?.data?.message || error);
      return false;
    }
  }

  async bulkDelete(ids) {
    try {
      const params = { 
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return { success: false, deletedCount: 0 };
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bookmarks:`, failed);
        }
        
        return { success: true, deletedCount: successful.length };
      }
      
      return { success: true, deletedCount: ids.length };
    } catch (error) {
      console.error("Error bulk deleting bookmarks:", error?.response?.data?.message || error);
      return { success: false, deletedCount: 0 };
    }
  }

  async incrementAccessCount(id) {
    try {
      // First get current record
      const bookmark = await this.getById(id);
      if (!bookmark) return null;
      
      const currentCount = bookmark.access_count_c || 0;
      
      const params = {
        records: [{
          Id: parseInt(id),
          access_count_c: currentCount + 1,
          last_accessed_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return bookmark;
    } catch (error) {
      console.error("Error incrementing access count:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getRecent(limit = 10) {
    try {
const params = {
        fields: [
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "folder_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_accessed_c"}},
          {"field": {"Name": "access_count_c"}}
        ],
        where: [{"FieldName": "Owner", "Operator": "EqualTo", "Values": [store.getState().user.user?.userId]}],
        orderBy: [{"fieldName": "last_accessed_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent bookmarks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getPopular(limit = 10) {
    try {
      const params = {
fields: [
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "favicon_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "folder_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_accessed_c"}},
          {"field": {"Name": "access_count_c"}}
        ],
        where: [{"FieldName": "Owner", "Operator": "EqualTo", "Values": [store.getState().user.user?.userId]}],
        orderBy: [{"fieldName": "access_count_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching popular bookmarks:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new BookmarkService();