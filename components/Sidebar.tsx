"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Car,
  Building2,
  FileText,
  Upload,
  FolderOpen,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Warehouse,
  LogIn,
  LogOut,
  User,
} from "lucide-react";

const navSections = [
  {
    label: "Browse",
    items: [
      { href: "/", label: "Home", icon: LayoutDashboard },
      { href: "/cars", label: "Cars", icon: Car },
      { href: "/real-estate", label: "Real Estate", icon: Building2 },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/upload", label: "Upload Asset", icon: Upload },
      { href: "/manage", label: "My Assets", icon: FolderOpen },
      { href: "/rentals", label: "My Rentals", icon: CalendarCheck },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/documents", label: "Documents", icon: FileText },
    ],
  },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              RentVault
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <Warehouse className="h-4 w-4 text-white" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User / Auth footer */}
      <div className="border-t border-slate-200 p-3">
        {isAuthenticated && user ? (
          <div className={`flex items-center gap-3 rounded-xl p-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName || ""} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                (user.fullName || user.email)[0].toUpperCase()
              )}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {user.fullName || user.email}
                  </p>
                  <p className="truncate text-[10px] text-slate-400">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Sign in" : undefined}
          >
            <LogIn className="h-5 w-5 text-slate-400" />
            {!collapsed && <span>Sign in</span>}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>

      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white transition-all duration-300 ${
          collapsed ? "lg:w-[72px]" : "lg:w-64"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default Sidebar;
