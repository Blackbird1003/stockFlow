"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/reports", label: "Reports", icon: BarChart3, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const filteredNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  // Listen for mobile menu toggle from Topbar
  useEffect(() => {
    const handler = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-menu", handler);
    return () => window.removeEventListener("toggle-mobile-menu", handler);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarContent = (isMobile: boolean) => (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out",
        isMobile ? "w-72" : collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Desktop collapse toggle */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 border border-slate-600 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      )}

      {/* Logo + mobile close button */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-slate-800",
          !isMobile && collapsed ? "justify-center px-2" : "justify-between"
        )}
      >
        <Logo collapsed={!isMobile && collapsed} />
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Badge */}
      {(!collapsed || isMobile) && (
        <div className="px-4 py-2">
          <Badge
            className={cn(
              "text-[10px] font-semibold tracking-wider uppercase",
              isAdmin
                ? "bg-indigo-600/20 text-indigo-400 border-indigo-600/30"
                : "bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
            )}
            variant="outline"
          >
            {isAdmin ? "Administrator" : "Staff"}
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                !isMobile && collapsed && "justify-center px-2"
              )}
              title={!isMobile && collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "w-5 h-5 text-white" : "w-5 h-5"
                )}
              />
              {(isMobile || !collapsed) && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Blackbird AI button */}
        <button
          onClick={() => {
            setMobileOpen(false);
            window.dispatchEvent(new CustomEvent("open-blackbird"));
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            "text-indigo-400 hover:bg-indigo-600/20 hover:text-indigo-300",
            !isMobile && collapsed && "justify-center px-2"
          )}
          title={!isMobile && collapsed ? "Blackbird AI" : undefined}
        >
          <Sparkles className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          {(isMobile || !collapsed) && (
            <span className="truncate">Blackbird AI</span>
          )}
        </button>
      </nav>

      {/* Bottom section */}
      <div
        className={cn(
          "p-3 border-t border-slate-800",
          !isMobile && collapsed && "flex justify-center"
        )}
      >
        {isMobile || !collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center w-full gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors group">
                <Avatar className="h-8 w-8 shrink-0">
                  {session?.user?.avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.avatarUrl}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex h-screen flex-shrink-0">
        {sidebarContent(false)}
      </div>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative h-full">
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
