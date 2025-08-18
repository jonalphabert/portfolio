import NumberFlow from '@number-flow/react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  default: 'text-accent',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
};

export function StatsCard({ title, value, icon: Icon, trend, color = 'default' }: StatsCardProps) {
  return (
    <Card className='flex justify-center'>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-muted-foreground text-sm font-medium'>{title}</p>
            <div className='mt-2 flex items-center gap-2'>
              <NumberFlow value={value} className={`text-3xl font-bold ${colorClasses[color]}`} />
              {trend && (
                <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
        </div>
      </CardContent>
    </Card>
  );
}
