import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Calendar,
  Tag,
  FileText,
  Layout
} from "lucide-react";
import { Content, Category } from "../../../shared/schema";
import { formatDate, stripHtml, truncate, cn } from "../lib/utils";

export function ContentList() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { data: allContent = [], isLoading: contentLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Filter content based on search and filters
  const filteredContent = allContent.filter(content => {
    const matchesSearch = !searchQuery || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || content.category === selectedCategory;
    const matchesStatus = !selectedStatus || content.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (contentLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Content</h1>
          <p className="text-muted-foreground">
            Manage your posts, pages, and articles
          </p>
        </div>
        <Link href="/content/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No content found</p>
                <p className="mb-4">
                  {searchQuery || selectedCategory || selectedStatus
                    ? "Try adjusting your search or filters"
                    : "Create your first piece of content to get started"
                  }
                </p>
                <Link href="/content/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Content
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((content) => (
            <Card key={content.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Link href={`/content/${content.id}`}>
                        <h3 className="text-lg font-semibold hover:text-primary cursor-pointer truncate">
                          {content.title}
                        </h3>
                      </Link>
                      <Badge variant={content.status === "published" ? "default" : "secondary"}>
                        {content.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {content.contentType === "page" ? (
                          <>
                            <Layout className="h-3 w-3 mr-1" />
                            Page
                          </>
                        ) : (
                          <>
                            <FileText className="h-3 w-3 mr-1" />
                            Article
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {content.excerpt || truncate(stripHtml(content.content), 120)}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{content.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(content.updatedAt)}</span>
                      </div>
                      {content.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>Tags:</span>
                          <div className="flex space-x-1">
                            {content.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {content.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{content.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {content.status === "published" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/content/view/${content.slug}`, "_blank")}
                        title="View Live"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Link href={`/content/${content.id}/edit`}>
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}