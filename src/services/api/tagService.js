import tagsData from "../mockData/tags.json";

class TagService {
  constructor() {
    this.tags = [...tagsData];
  }

  async delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.tags];
  }

  async getPopular(limit = 20) {
    await this.delay();
    return this.tags
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
      .map(t => ({ ...t }));
  }

  async search(query) {
    await this.delay(200);
    if (!query || query.trim() === "") {
      return [...this.tags];
    }

    const searchTerm = query.toLowerCase();
    return this.tags
      .filter(tag => tag.name.toLowerCase().includes(searchTerm))
      .map(t => ({ ...t }));
  }

  async create(tagData) {
    await this.delay(300);
    
    // Check if tag already exists
    const existingTag = this.tags.find(t => t.name.toLowerCase() === tagData.name.toLowerCase());
    if (existingTag) {
      return { ...existingTag };
    }

    const maxId = Math.max(...this.tags.map(t => t.Id), 0);
    const newTag = {
      Id: maxId + 1,
      name: tagData.name.toLowerCase(),
      color: tagData.color || "#64748b",
      usageCount: 1
    };

    this.tags.push(newTag);
    return { ...newTag };
  }

  async incrementUsage(tagName) {
    await this.delay(100);
    
    const tag = this.tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (tag) {
      tag.usageCount += 1;
    }
    
    return tag ? { ...tag } : null;
  }
}

export default new TagService();