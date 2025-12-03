import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Calendar,
  GraduationCap,
  FileText,
  UserCircle,
  ClipboardList,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Settings,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const userRole = user?.user_role;
  const isAdmin = user?.role === 'admin';
  const isModel = userRole === 'model';
  const isChatter = userRole === 'chatter';
  const hasNoRole = !isAdmin && !isModel && !isChatter;

  // Redirect users without role to SelectRole page
  useEffect(() => {
    if (user && hasNoRole && currentPageName !== "SelectRole" && currentPageName !== "Apply" && currentPageName !== "Welcome") {
      window.location.href = createPageUrl('SelectRole');
    }
  }, [user, hasNoRole, currentPageName]);

  // Protect pages based on role
  const allowedPages = {
    admin: ["Dashboard", "Applications", "Users", "Shifts", "Models", "Training", "Documents", "Settings"],
    chatter: ["ChatterDashboard", "MyShifts", "MyTraining", "TrainingCourse", "Settings"],
    model: ["ModelDashboard", "MyProfile", "MyDocuments", "TeamChat", "Settings"],
  };

  useEffect(() => {
    if (user && !hasNoRole && currentPageName !== "Apply" && currentPageName !== "Welcome" && currentPageName !== "SelectRole") {
      const role = isAdmin ? 'admin' : (isChatter ? 'chatter' : 'model');
      const allowed = allowedPages[role] || [];
      
      if (!allowed.includes(currentPageName)) {
        // Redirect to correct dashboard
        if (isAdmin) {
          window.location.href = createPageUrl('Dashboard');
        } else if (isChatter) {
          window.location.href = createPageUrl('ChatterDashboard');
        } else if (isModel) {
          window.location.href = createPageUrl('ModelDashboard');
        }
      }
    }
  }, [user, currentPageName, isAdmin, isChatter, isModel, hasNoRole]);

  const getNavItems = () => {
    const items = [];
    
    if (isAdmin) {
      items.push(
        { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
        { name: "Bewerbungen", icon: ClipboardList, page: "Applications" },
        { name: "Nutzer", icon: Users, page: "Users" },
        { name: "Schichtplan", icon: Calendar, page: "Shifts" },
        { name: "Models", icon: UserCircle, page: "Models" },
        { name: "Schulungen", icon: GraduationCap, page: "Training" },
        { name: "Dokumente", icon: FileText, page: "Documents" },
      );
    } else if (isChatter) {
      items.push(
        { name: "Übersicht", icon: LayoutDashboard, page: "ChatterDashboard" },
        { name: "Meine Schichten", icon: Calendar, page: "MyShifts" },
        { name: "Schulungen", icon: GraduationCap, page: "MyTraining" },
      );
    } else if (isModel) {
      items.push(
        { name: "Übersicht", icon: LayoutDashboard, page: "ModelDashboard" },
        { name: "Mein Profil", icon: UserCircle, page: "MyProfile" },
        { name: "Dokumente", icon: FileText, page: "MyDocuments" },
        { name: "Team Chat", icon: Users, page: "TeamChat" },
      );
    }
    
    return items;
  };

  const navItems = getNavItems();

  // Show loading while checking role
  if (!user || hasNoRole) {
    if (currentPageName !== "Apply" && currentPageName !== "Welcome" && currentPageName !== "SelectRole") {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
        </div>
      );
    }
  }

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (currentPageName === "Apply" || currentPageName === "Welcome" || currentPageName === "SelectRole") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --accent: 262 83% 58%;
          --accent-light: 262 83% 95%;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-slate-900">Agency Hub</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900">Agency Hub</h1>
            <p className="text-xs text-slate-500">Management Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-violet-50 text-violet-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-600' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-violet-100 text-violet-700">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.full_name || 'Nutzer'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{userRole || 'Nutzer'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to={createPageUrl("Settings")} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Einstellungen
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}