class TagService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'tag_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "usage_count_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tags:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getPopular(limit = 20) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "usage_count_c"}}
        ],
        orderBy: [{"fieldName": "usage_count_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching popular tags:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "usage_count_c"}}
        ],
        where: [{"FieldName": "name_c", "Operator": "Contains", "Values": [query.toLowerCase()]}],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching tags:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(tagData) {
    try {
      // First check if tag already exists
      const existingTags = await this.search(tagData.name_c);
      const existingTag = existingTags.find(t => t.name_c.toLowerCase() === tagData.name_c.toLowerCase());
      
      if (existingTag) {
        return existingTag;
      }

      const params = {
        records: [{
          name_c: tagData.name_c.toLowerCase(),
          color_c: tagData.color_c || "#64748b",
          usage_count_c: 1
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
          console.error(`Failed to create ${failed.length} tags:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating tag:", error?.response?.data?.message || error);
      return null;
    }
  }

  async incrementUsage(tagName) {
    try {
      // Find the tag first
      const tags = await this.search(tagName);
      const tag = tags.find(t => t.name_c.toLowerCase() === tagName.toLowerCase());
      
      if (!tag) return null;
      
      const currentCount = tag.usage_count_c || 0;
      
      const params = {
        records: [{
          Id: tag.Id,
          usage_count_c: currentCount + 1
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return tag;
    } catch (error) {
      console.error("Error incrementing tag usage:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export default new TagService();

export default new TagService();