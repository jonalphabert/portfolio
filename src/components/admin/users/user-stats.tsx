import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NumberFlow from '@number-flow/react';

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
}

export function UserStats({ totalUsers, activeUsers, inactiveUsers, adminUsers }: UserStatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      icon: UserX,
      color: 'text-red-600',
    },
    {
      title: 'Admins',
      value: adminUsers,
      icon: Shield,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>{stat.title}</p>
                <NumberFlow value={stat.value} className={`text-2xl font-bold ${stat.color}`} />
              </div>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
