import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../lib/utils";
import { 
  FileText, 
  FolderOpen, 
  Image, 
  Settings, 
  Plus,
  Search,
  Home
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "All Content", href: "/content", icon: FileText },
    { name: "Categories", href: "/categories", icon: FolderOpen },
    { name: "Media", href: "/media", icon: Image },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-xl font-bold">Personal CMS</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t">
            <Link href="/content/new">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Content
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}