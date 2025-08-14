'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserTable } from '@/components/admin/users/user-table';
import { UserStats } from '@/components/admin/users/user-stats';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar?: string;
};

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin' as const,
    status: 'active' as const,
    lastLogin: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'editor' as const,
    status: 'active' as const,
    lastLogin: '2024-01-14',
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'viewer' as const,
    status: 'inactive' as const,
    lastLogin: '2024-01-10',
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'active').length,
    inactiveUsers: users.filter((u) => u.status === 'inactive').length,
    adminUsers: users.filter((u) => u.role === 'admin').length,
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Delete user:', userId);
  };

  return (
    <section className='p-6'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Users</h1>
            <p className='text-muted-foreground'>Manage user accounts and permissions</p>
          </div>
          <Button className='cursor-pointer'>
            <Plus className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </div>

        <UserStats {...stats} />

        <div className='mb-4 flex items-center space-x-2'>
          <Search className='text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search users...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-sm'
          />
        </div>

        <UserTable users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      </div>
    </section>
  );
}
