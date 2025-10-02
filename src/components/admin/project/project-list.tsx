'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, Calendar, Eye, Edit, Globe, Star, Archive, 
  Plus, Filter 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { Project } from '@/types';
import { toast } from 'sonner';


const PROJECTS_PER_PAGE = 9;

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const fetchProjects = useCallback(async (page = 1, search = '', status = 'all', isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      
      const params = new URLSearchParams({
        limit: PROJECTS_PER_PAGE.toString(),
        page: page.toString(),
        sort: 'latest',
        ...(search && { search }),
        ...(status !== 'all' && { status })
      });
      
      const response = await fetch(`/api/project?${params}`);
      const data = await response.json();
      setProjects(data.projects || []);
      setTotalProjects(data.total || 0);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    if (loading) {
      // Initial load
      fetchProjects(currentPage, debouncedSearchQuery, selectedStatus, true);
    } else {
      // Search/filter/pagination
      fetchProjects(currentPage, debouncedSearchQuery, selectedStatus, false);
    }
  }, [fetchProjects, currentPage, debouncedSearchQuery, selectedStatus, loading]);

  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAction = async (slug: string, action: 'publish' | 'featured' | 'archive') => {
    if (action === 'featured') {
      // Optimistic update for featured
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.project_slug === slug 
            ? { ...project, is_featured: !project.is_featured }
            : project
        )
      );
      
      try {
        const response = await fetch(`/api/project/${slug}/${action}`, {
          method: 'PUT',
        });

        if (!response.ok) {
          // Revert optimistic update on error
          setProjects(prevProjects => 
            prevProjects.map(project => 
              project.project_slug === slug 
                ? { ...project, is_featured: !project.is_featured }
                : project
            )
          );
          toast.error('Gagal mengubah status featured project');
        }
      } catch (error) {
        console.error(`Error ${action} project:`, error);
        // Revert optimistic update on error
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.project_slug === slug 
              ? { ...project, is_featured: !project.is_featured }
              : project
          )
        );
        toast.error('Gagal mengubah status featured project');
      }
    } else {
      // Regular API call for other actions
      try {
        const response = await fetch(`/api/project/${slug}/${action}`, {
          method: 'PUT',
        });

        if (response.ok) {
          // Refresh the list
          fetchProjects(currentPage, debouncedSearchQuery, selectedStatus, false);
        }
      } catch (error) {
        console.error(`Error ${action} project:`, error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 bg-muted animate-pulse rounded w-64" />
          <div className="h-10 bg-muted animate-pulse rounded w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border-input bg-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* New Project Button */}
        <Link href="/admin/project/editor">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="relative">
        {searching && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-md shadow-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Searching...
            </div>
          </div>
        )}
        
        {projects.length === 0 && !searching ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No projects found matching your search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
            {projects.map((project) => (
              <Card key={project.project_id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg py-0 gap-2">
                <div className="relative overflow-hidden">
                  <Image
                    src={project.thumbnail?.image_path || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'}
                    alt={project.thumbnail?.image_alt || project.project_title}
                    width={400}
                    height={192}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={getStatusColor(project.project_status)}>
                      {project.project_status}
                    </Badge>
                    {project.is_featured && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Star className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="px-6 py-2">
                  <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.published_at || project.created_at)}
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold line-clamp-2">
                    {project.project_title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.project_description}
                  </p>

                  {/* Tech Stacks */}
                  <div className="mb-4 flex flex-wrap gap-1">
                    {project.project_tech_stacks.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.project_tech_stacks.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.project_tech_stacks.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/project/preview/${project.project_slug}`}>
                        <Button variant="ghost" size="sm" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/project/editor/${project.project_slug}`}>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" title="Live Demo">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {project.project_status !== 'published' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAction(project.project_slug, 'publish')}
                          title="Publish"
                          className="text-green-600 hover:text-green-700"
                        >
                          Publish
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(project.project_slug, 'featured')}
                        title={project.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                        className={project.is_featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}
                      >
                        <Star className={`h-4 w-4 ${project.is_featured ? 'fill-current' : ''}`} />
                      </Button>
                      {project.project_status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(project.project_slug, 'archive')}
                          title="Archive"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {projects.length} of {totalProjects} projects
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
        )}
      </div>
    </>
  );
}