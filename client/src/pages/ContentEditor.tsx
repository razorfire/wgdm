import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { RichTextEditor } from "../components/RichTextEditor";
import { GrapesJSEditor } from "../components/GrapesJSEditor";
import { ContentPreview } from "../components/ContentPreview";
import { Save, ArrowLeft, Eye, X, FileText, Layout } from "lucide-react";
import { Content, Category, insertContentSchema } from "../../../shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { slugify } from "../lib/utils";

const contentFormSchema = insertContentSchema.extend({
  tags: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

export function ContentEditor() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [contentType, setContentType] = useState<"richtext" | "page">("richtext");
  const [pageCSS, setPageCSS] = useState("");
  
  const isEditing = params.id !== "new";
  const contentId = isEditing ? params.id : null;

  const { data: content, isLoading } = useQuery<Content>({
    queryKey: ["/api/content", contentId],
    enabled: !!contentId,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      category: "",
      status: "draft",
      featuredImage: "",
      contentType: "richtext",
      pageCSS: "",
    },
  });

  const { watch, setValue, handleSubmit } = form;
  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !isEditing) {
      setValue("slug", slugify(watchedTitle));
    }
  }, [watchedTitle, isEditing, setValue]);

  // Load content data when editing
  useEffect(() => {
    if (content) {
      form.reset({
        title: content.title,
        content: content.content,
        excerpt: content.excerpt || "",
        slug: content.slug,
        category: content.category,
        status: content.status,
        featuredImage: content.featuredImage || "",
        contentType: content.contentType || "richtext",
        pageCSS: content.pageCSS || "",
      });
      setTags(content.tags);
      setContentType(content.contentType || "richtext");
      setPageCSS(content.pageCSS || "");
    }
  }, [content, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const payload = {
        ...data,
        tags,
      };
      
      if (isEditing) {
        return apiRequest(`/api/content/${contentId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        return apiRequest("/api/content", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setLocation("/content");
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = (data: ContentFormData) => {
    saveMutation.mutate({
      ...data,
      contentType,
      pageCSS,
    });
  };

  const handleGrapesJSChange = (html: string, css: string) => {
    setValue("content", html);
    setPageCSS(css);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-40 bg-muted rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/content")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Content" : "New Content"}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <ContentPreview
            content={watchedContent}
            css={pageCSS}
            contentType={contentType}
          />
          <Button
            variant="outline"
            onClick={() => form.setValue("status", "draft")}
          >
            Save as Draft
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saveMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {saveMutation.isPending ? "Saving..." : "Save & Publish"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    {...form.register("title")}
                    placeholder="Enter content title..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Slug</label>
                  <Input
                    {...form.register("slug")}
                    placeholder="url-friendly-slug"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Excerpt</label>
                  <Textarea
                    {...form.register("excerpt")}
                    placeholder="Brief description of your content..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <div className="flex space-x-2 mb-4">
                    <Button
                      type="button"
                      variant={contentType === "richtext" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContentType("richtext")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Rich Text
                    </Button>
                    <Button
                      type="button"
                      variant={contentType === "page" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContentType("page")}
                    >
                      <Layout className="mr-2 h-4 w-4" />
                      Page Builder
                    </Button>
                  </div>
                  
                  {contentType === "richtext" ? (
                    <RichTextEditor
                      value={watchedContent}
                      onChange={(value) => setValue("content", value)}
                      placeholder="Start writing your content..."
                    />
                  ) : (
                    <GrapesJSEditor
                      value={watchedContent}
                      onChange={handleGrapesJSChange}
                      height="600px"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    {...form.register("status")}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    {...form.register("category")}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Featured Image URL</label>
                  <Input
                    {...form.register("featuredImage")}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}