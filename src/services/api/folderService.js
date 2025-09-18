class FolderService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'folder_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "parent_folder_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "bookmark_count_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching folders:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "parent_folder_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "bookmark_count_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching folder ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getRootFolders() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "parent_folder_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "bookmark_count_c"}}
        ],
        where: [{"FieldName": "parent_folder_c", "Operator": "DoesNotHaveValue", "Values": []}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching root folders:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getSubfolders(parentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "parent_folder_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "bookmark_count_c"}}
        ],
        where: [{"FieldName": "parent_folder_c", "Operator": "EqualTo", "Values": [parseInt(parentId)]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching subfolders:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(folderData) {
    try {
      const params = {
        records: [{
          name_c: folderData.name_c,
          parent_folder_c: folderData.parent_folder_c ? parseInt(folderData.parent_folder_c) : null,
          color_c: folderData.color_c || "#64748b",
          bookmark_count_c: 0
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
          console.error(`Failed to create ${failed.length} folders:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating folder:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, folderData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: folderData.name_c,
          parent_folder_c: folderData.parent_folder_c ? parseInt(folderData.parent_folder_c) : null,
          color_c: folderData.color_c || "#64748b"
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
          console.error(`Failed to update ${failed.length} folders:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating folder:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      // First check if folder has subfolders
      const subfolders = await this.getSubfolders(id);
      if (subfolders.length > 0) {
        throw new Error("Cannot delete folder with subfolders");
      }
      
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
          console.error(`Failed to delete ${failed.length} folders:`, failed);
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting folder:", error?.response?.data?.message || error);
      return false;
    }
  }

  async updateBookmarkCount(id, count) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          bookmark_count_c: count
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating bookmark count:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export default new FolderService();