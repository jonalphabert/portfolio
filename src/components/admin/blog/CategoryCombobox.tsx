'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
}

interface CategoryComboboxProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
}

export function CategoryCombobox({ value, onValueChange, placeholder = "Select categories..." }: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchCategories = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('limit', '10');

      const response = await fetch(`/api/category?${params}`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCategories(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchCategories]);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async () => {
    if (!searchTerm.trim()) return;

    try {
      setCreating(true);
      const response = await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: searchTerm.trim(),
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [newCategory, ...prev]);
        onValueChange([...value, newCategory.category_id]);
        setSearchTerm('');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleCategory = (categoryId: string) => {
    if (value.includes(categoryId)) {
      onValueChange(value.filter(v => v !== categoryId));
    } else {
      onValueChange([...value, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    onValueChange(value.filter(v => v !== categoryId));
  };

  const hasExactMatch = categories.some(cat => 
    cat.category_name.toLowerCase() === searchTerm.toLowerCase()
  );

  return (
    <div className="space-y-2">
      <Label>Categories</Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0 ? `${value.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : categories.length === 0 ? (
                searchTerm && !hasExactMatch ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleCreateCategory}
                    disabled={creating}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {creating ? 'Creating...' : `Create "${searchTerm}"`}
                  </Button>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">No categories found.</div>
                )
              ) : (
                <>
                  {categories.map((category) => (
                    <Button
                      key={category.category_id}
                      variant="ghost"
                      className="w-full justify-start mb-1"
                      onClick={() => handleToggleCategory(category.category_id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(category.category_id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.category_name}
                    </Button>
                  ))}
                  
                  {searchTerm && !hasExactMatch && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start mt-2 border-t pt-2"
                      onClick={handleCreateCategory}
                      disabled={creating}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {creating ? 'Creating...' : `Create "${searchTerm}"`}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Selected categories */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((categoryId) => {
            const category = categories.find(c => c.category_id === categoryId);
            return (
              <Badge key={categoryId} variant="secondary" className="pr-1">
                {category?.category_name || categoryId}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleRemoveCategory(categoryId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}