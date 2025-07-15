import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, X } from "lucide-react";

interface ContentPreviewProps {
  content: string;
  css?: string;
  contentType: "richtext" | "page";
}

export function ContentPreview({ content, css, contentType }: ContentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Content Preview</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          <div className="border rounded-lg overflow-hidden">
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
        
        {contentType === "page" && css && (
          <style>
            {css}
          </style>
        )}
      </div>
    </div>
  );
}