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
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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

  const { data: user, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const userRole = user?.user_role;
  const isAdmin = user?.role === 'admin';
  const isModel = userRole === 'model';
  const isChatter = userRole === 'chatter';
  const isVIP = userRole === 'vip';
  const hasNoRole = !isAdmin && !isModel && !isChatter && !isVIP;

  // Redirect users without role to SelectRole page
  useEffect(() => {
    if (user && hasNoRole && currentPageName !== "SelectRole" && currentPageName !== "Apply" && currentPageName !== "Welcome") {
      window.location.href = createPageUrl('SelectRole');
    }
  }, [user, hasNoRole, currentPageName]);

  // Protect pages based on role
  const allowedPages = {
    admin: ["Dashboard", "Applications", "Users", "Shifts", "Models", "Training", "Documents", "AdminVideoManagement", "TeamMindmap", "Settings"],
    chatter: ["ChatterDashboard", "MyShifts", "MyTraining", "TrainingCourse", "TeamMindmap", "Settings"],
    model: ["ModelDashboard", "MyProfile", "MyDocuments", "TeamChat", "TeamMindmap", "Settings"],
    vip: ["VIPDashboard", "TeamMindmap", "Settings"],
  };

  useEffect(() => {
    if (user && !hasNoRole && currentPageName !== "Apply" && currentPageName !== "Welcome" && currentPageName !== "SelectRole") {
      const role = isAdmin ? 'admin' : (isChatter ? 'chatter' : (isModel ? 'model' : 'vip'));
      const allowed = allowedPages[role] || [];
      
      if (!allowed.includes(currentPageName)) {
        // Redirect to correct dashboard
        if (isAdmin) {
          window.location.href = createPageUrl('Dashboard');
        } else if (isChatter) {
          window.location.href = createPageUrl('ChatterDashboard');
        } else if (isModel) {
          window.location.href = createPageUrl('ModelDashboard');
        } else if (isVIP) {
          window.location.href = createPageUrl('VIPDashboard');
        }
      }
    }
  }, [user, currentPageName, isAdmin, isChatter, isModel, isVIP, hasNoRole]);

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
        { name: "VIP Videos", icon: Bell, page: "AdminVideoManagement" },
        { name: "Team Hierarchie", icon: Users, page: "TeamMindmap" },
      );
    } else if (isChatter) {
      items.push(
        { name: "Übersicht", icon: LayoutDashboard, page: "ChatterDashboard" },
        { name: "Meine Schichten", icon: Calendar, page: "MyShifts" },
        { name: "Schulungen", icon: GraduationCap, page: "MyTraining" },
        { name: "Team Hierarchie", icon: Users, page: "TeamMindmap" },
      );
    } else if (isModel) {
      items.push(
        { name: "Übersicht", icon: LayoutDashboard, page: "ModelDashboard" },
        { name: "Mein Profil", icon: UserCircle, page: "MyProfile" },
        { name: "Dokumente", icon: FileText, page: "MyDocuments" },
        { name: "Team Chat", icon: Users, page: "TeamChat" },
        { name: "Team Hierarchie", icon: Users, page: "TeamMindmap" },
      );
    } else if (isVIP) {
      items.push(
        { name: "Videos", icon: LayoutDashboard, page: "VIPDashboard" },
        { name: "Team Hierarchie", icon: Users, page: "TeamMindmap" },
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

  // Public pages that don't require authentication
  const publicPages = ["Apply", "Welcome", "SelectRole", "Landing", "PrivacyPolicy", "TermsOfService"];
  if (publicPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  // If authentication failed on protected pages, redirect to login
  if (isError && !publicPages.includes(currentPageName)) {
    base44.auth.redirectToLogin();
    return null;
  }

  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50/30 dark:from-slate-950 dark:to-slate-900">
      <style>{`
        :root {
          --primary: 326 100% 54%;
          --primary-foreground: 0 0% 100%;
          --accent: 326 100% 54%;
          --accent-light: 326 100% 95%;
          --brand-pink: #e946d9;
          --brand-pink-dark: #b535a8;
        }
        .dark {
          --primary: 326 100% 54%;
          --primary-foreground: 0 0% 100%;
          --accent: 326 100% 64%;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-slate-900 dark:text-white" /> : <Menu className="w-6 h-6 text-slate-900 dark:text-white" />}
        </button>
        <div className="flex items-center gap-2">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693030ca295a4a8076dbf6c8/18cfc3c09_AlbedoBase_XL_A_pink_star_on_a_transparent_background_inside_t_0.png" 
            alt="Model2Star" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-slate-900 dark:text-white">Model<span className="text-pink-600 dark:text-pink-400">2</span>Star</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {isAdmin && <NotificationBell />}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693030ca295a4a8076dbf6c8/18cfc3c09_AlbedoBase_XL_A_pink_star_on_a_transparent_background_inside_t_0.png" 
            alt="Model2Star" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white">Model<span className="text-pink-600 dark:text-pink-400">2</span>Star</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Management Platform</p>
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
                    ? 'bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 text-pink-700 dark:text-pink-300 font-medium shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-pink-600 dark:text-pink-400' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Notifications & Theme (Desktop) */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <ThemeSwitcher />
          {isAdmin && <NotificationBell />}
        </div>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user?.full_name || 'Nutzer'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole || 'Nutzer'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
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
    </ThemeProvider>
  );
}