"use client";

import { useState } from "react";
import { FileText, BookOpen, CircleHelp as HelpCircle, Shield, Code, Settings, ChevronRight, Search, Car, Building2 } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-500",
    items: [
      {
        title: "Introduction",
        description: "Learn about the Showcase platform and its features.",
      },
      {
        title: "Quick Start Guide",
        description: "Get up and running with your first search in under 5 minutes.",
      },
      {
        title: "Navigation Overview",
        description: "Understand the sidebar, pages, and how to move around the app.",
      },
    ],
  },
  {
    title: "Car Catalogue",
    icon: Car,
    color: "bg-emerald-50 text-emerald-500",
    items: [
      {
        title: "Browsing Cars",
        description: "How to browse, filter, and search through the car catalogue.",
      },
      {
        title: "Filter Options",
        description: "Detailed guide on fuel type, year, class, drive, and transmission filters.",
      },
      {
        title: "Car Details",
        description: "Understanding MPG, cylinders, displacement, and rental pricing.",
      },
      {
        title: "Rental Pricing",
        description: "How daily rental rates are calculated based on vehicle specs.",
      },
    ],
  },
  {
    title: "Real Estate",
    icon: Building2,
    color: "bg-amber-50 text-amber-500",
    items: [
      {
        title: "Property Listings",
        description: "How to browse and filter properties for sale and rent.",
      },
      {
        title: "Property Types",
        description: "Understanding houses, apartments, condos, villas, and more.",
      },
      {
        title: "Pricing & Availability",
        description: "How sale prices and rental rates are displayed.",
      },
      {
        title: "Property Details",
        description: "Understanding area, bedrooms, bathrooms, garage, and amenities.",
      },
    ],
  },
  {
    title: "API & Integration",
    icon: Code,
    color: "bg-rose-50 text-rose-500",
    items: [
      {
        title: "API Overview",
        description: "Introduction to the Showcase API endpoints and authentication.",
      },
      {
        title: "Data Models",
        description: "Car and Real Estate data schemas and type definitions.",
      },
      {
        title: "Filter Parameters",
        description: "Complete reference for all filter and query parameters.",
      },
    ],
  },
  {
    title: "Settings & Configuration",
    icon: Settings,
    color: "bg-teal-50 text-teal-500",
    items: [
      {
        title: "User Preferences",
        description: "Customize display, pagination, and default filters.",
      },
      {
        title: "Data Management",
        description: "How to add, update, or remove listings from the catalogue.",
      },
    ],
  },
  {
    title: "Legal & Security",
    icon: Shield,
    color: "bg-slate-100 text-slate-500",
    items: [
      {
        title: "Privacy Policy",
        description: "How we collect, use, and protect your personal information.",
      },
      {
        title: "Terms of Service",
        description: "The terms and conditions for using the Showcase platform.",
      },
      {
        title: "Data Security",
        description: "Our approach to securing your data and preventing unauthorized access.",
      },
    ],
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = docSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900">Documentation</h1>
        </div>
        <p className="text-sm text-slate-500">
          Everything you need to know about using the Showcase platform
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Getting Started</p>
            <p className="text-xs text-slate-500">New here? Start here.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
            <HelpCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">FAQ</p>
            <p className="text-xs text-slate-500">Common questions answered.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
            <Code className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">API Reference</p>
            <p className="text-xs text-slate-500">Developer documentation.</p>
          </div>
        </div>
      </div>

      {/* Doc Sections */}
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${section.color}`}>
                <section.icon className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white px-5 py-4 transition-all hover:border-slate-200 hover:shadow-sm cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No results found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try a different search term
          </p>
        </div>
      )}
    </div>
  );
}
