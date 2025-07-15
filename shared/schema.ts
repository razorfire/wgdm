import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Content model for CMS
export const ContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  slug: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  status: z.enum(["draft", "published", "archived"]),
  featuredImage: z.string().optional(),
  contentType: z.enum(["richtext", "page"]).default("richtext"),
  pageCSS: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Category model
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  slug: z.string(),
  createdAt: z.string(),
});

// Media model
export const MediaSchema = z.object({
  id: z.string(),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  alt: z.string().optional(),
  createdAt: z.string(),
});

// Insert schemas for forms
export const insertContentSchema = ContentSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertCategorySchema = CategorySchema.omit({ id: true, createdAt: true });
export const insertMediaSchema = MediaSchema.omit({ id: true, createdAt: true });

// Types
export type Content = z.infer<typeof ContentSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Media = z.infer<typeof MediaSchema>;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertMedia = z.infer<typeof insertMediaSchema>;