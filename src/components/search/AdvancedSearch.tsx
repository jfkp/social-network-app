"use client";

interface SearchFilters {
  type: 'posts' | 'users' | 'hashtags';
  dateRange?: { start: Date; end: Date };
  hasMedia?: boolean;
  location?: string;
  sortBy: 'recent' | 'popular';
}

export default function AdvancedSearch() {
  // Implementation for advanced search
} 