import { Edit, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar?: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'editor':
      return 'bg-blue-100 text-blue-800';
    case 'viewer':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {users.map((user) => (
            <div
              key={user.id}
              className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
                    <User className='h-5 w-5' />
                  </div>
                  <div>
                    <div className='mb-1 flex items-center gap-2'>
                      <h3 className='font-semibold'>{user.name}</h3>
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </div>
                    <p className='text-muted-foreground text-sm'>{user.email}</p>
                    <p className='text-muted-foreground text-xs'>
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEdit(user)}
                    className='cursor-pointer'
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='cursor-pointer text-red-600 hover:text-red-700'
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
