import { Content, Category, Media, InsertContent, InsertCategory, InsertMedia } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

export interface IStorage {
  // Content operations
  createContent(content: InsertContent): Promise<Content>;
  getContent(id: string): Promise<Content | null>;
  getAllContent(): Promise<Content[]>;
  updateContent(id: string, content: Partial<InsertContent>): Promise<Content>;
  deleteContent(id: string): Promise<void>;
  getContentBySlug(slug: string): Promise<Content | null>;
  getContentByCategory(category: string): Promise<Content[]>;
  getContentByStatus(status: "draft" | "published" | "archived"): Promise<Content[]>;
  searchContent(query: string): Promise<Content[]>;

  // Category operations
  createCategory(category: InsertCategory): Promise<Category>;
  getCategory(id: string): Promise<Category | null>;
  getAllCategories(): Promise<Category[]>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  getCategoryBySlug(slug: string): Promise<Category | null>;

  // Media operations
  createMedia(media: InsertMedia): Promise<Media>;
  getMedia(id: string): Promise<Media | null>;
  getAllMedia(): Promise<Media[]>;
  updateMedia(id: string, media: Partial<InsertMedia>): Promise<Media>;
  deleteMedia(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private content: Content[] = [];
  private categories: Category[] = [];
  private media: Media[] = [];

  constructor() {
    // Initialize with some sample data
    this.seedData();
  }

  private seedData() {
    // Create default categories
    const defaultCategories = [
      { name: "Blog", description: "Blog posts and articles", color: "#3B82F6", slug: "blog" },
      { name: "Pages", description: "Static pages", color: "#10B981", slug: "pages" },
      { name: "Notes", description: "Personal notes", color: "#F59E0B", slug: "notes" },
    ];

    defaultCategories.forEach(cat => {
      this.categories.push({
        id: uuidv4(),
        ...cat,
        createdAt: new Date().toISOString(),
      });
    });

    // Create sample content
    const sampleContent = [
      {
        title: "Welcome to Your CMS",
        content: "<h1>Welcome to Your Personal Content Management System</h1><p>This is your first post! You can edit this content using the rich text editor.</p><p>Features include:</p><ul><li>Rich text editing</li><li>Category management</li><li>Media library</li><li>Content organization</li></ul>",
        excerpt: "Welcome to your personal content management system",
        slug: "welcome-to-your-cms",
        category: "blog",
        tags: ["welcome", "cms", "getting-started"],
        status: "published" as const,
        featuredImage: undefined,
        contentType: "richtext" as const,
        pageCSS: undefined,
      },
      {
        title: "About Page",
        content: "<h1>About</h1><p>This is your about page. You can customize this content to tell your story.</p>",
        excerpt: "Learn more about this site",
        slug: "about",
        category: "pages",
        tags: ["about", "info"],
        status: "published" as const,
        featuredImage: undefined,
        contentType: "richtext" as const,
        pageCSS: undefined,
      },
      {
        title: "Landing Page Demo",
        content: '<section class="hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20"><div class="container mx-auto text-center"><h1 class="text-4xl font-bold mb-4">Welcome to Our Service</h1><p class="text-xl mb-8">Experience the power of visual page building</p><button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Get Started</button></div></section><section class="py-16 bg-gray-50"><div class="container mx-auto px-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="text-center"><h3 class="text-2xl font-bold mb-4">Feature 1</h3><p>Amazing feature description</p></div><div class="text-center"><h3 class="text-2xl font-bold mb-4">Feature 2</h3><p>Another great feature</p></div><div class="text-center"><h3 class="text-2xl font-bold mb-4">Feature 3</h3><p>One more awesome feature</p></div></div></div></section>',
        excerpt: "A sample landing page built with GrapesJS",
        slug: "landing-page-demo",
        category: "pages",
        tags: ["demo", "landing", "page-builder"],
        status: "published" as const,
        featuredImage: undefined,
        contentType: "page" as const,
        pageCSS: ".hero-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); } .container { max-width: 1200px; }",
      },
    ];

    sampleContent.forEach(content => {
      this.content.push({
        id: uuidv4(),
        ...content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  }

  // Content operations
  async createContent(content: InsertContent): Promise<Content> {
    const newContent: Content = {
      id: uuidv4(),
      ...content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.content.push(newContent);
    return newContent;
  }

  async getContent(id: string): Promise<Content | null> {
    return this.content.find(c => c.id === id) || null;
  }

  async getAllContent(): Promise<Content[]> {
    return [...this.content].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async updateContent(id: string, updates: Partial<InsertContent>): Promise<Content> {
    const index = this.content.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Content not found");
    
    this.content[index] = {
      ...this.content[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.content[index];
  }

  async deleteContent(id: string): Promise<void> {
    this.content = this.content.filter(c => c.id !== id);
  }

  async getContentBySlug(slug: string): Promise<Content | null> {
    return this.content.find(c => c.slug === slug) || null;
  }

  async getContentByCategory(category: string): Promise<Content[]> {
    return this.content.filter(c => c.category === category);
  }

  async getContentByStatus(status: "draft" | "published" | "archived"): Promise<Content[]> {
    return this.content.filter(c => c.status === status);
  }

  async searchContent(query: string): Promise<Content[]> {
    const lowerQuery = query.toLowerCase();
    return this.content.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) ||
      c.content.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Category operations
  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: uuidv4(),
      ...category,
      createdAt: new Date().toISOString(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async getCategory(id: string): Promise<Category | null> {
    return this.categories.find(c => c.id === id) || null;
  }

  async getAllCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");
    
    this.categories[index] = {
      ...this.categories[index],
      ...updates,
    };
    return this.categories[index];
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return this.categories.find(c => c.slug === slug) || null;
  }

  // Media operations
  async createMedia(media: InsertMedia): Promise<Media> {
    const newMedia: Media = {
      id: uuidv4(),
      ...media,
      createdAt: new Date().toISOString(),
    };
    this.media.push(newMedia);
    return newMedia;
  }

  async getMedia(id: string): Promise<Media | null> {
    return this.media.find(m => m.id === id) || null;
  }

  async getAllMedia(): Promise<Media[]> {
    return [...this.media].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateMedia(id: string, updates: Partial<InsertMedia>): Promise<Media> {
    const index = this.media.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Media not found");
    
    this.media[index] = {
      ...this.media[index],
      ...updates,
    };
    return this.media[index];
  }

  async deleteMedia(id: string): Promise<void> {
    this.media = this.media.filter(m => m.id !== id);
  }
}