'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ onSearch, placeholder = 'Search images...' }: SearchInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value, onSearch]);

  return (
    <div className='relative'>
      <Search className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='pl-10'
      />
    </div>
  );
}