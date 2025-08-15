'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, UserPlus, UserMinus, Mail, Calendar, 
  TrendingUp, Send, Loader2 
} from 'lucide-react';
import { BroadcastModal } from './broadcast-modal';

interface SubscriberStats {
  newSubscribers: number;
  unsubscribed: number;
  activeSubscribers: number;
}

interface Subscriber {
  subscription_id: string;
  subscription_name: string;
  subscription_email: string;
  subscription_created_at: string;
  subscription_updated_at: string;
}

interface SubscriberData {
  stats: SubscriberStats;
  subscribers: Subscriber[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function SubscriberDashboard() {
  const [data, setData] = useState<SubscriberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subscriber?page=${page}&limit=10`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching subscriber data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return <div>Error loading subscriber data</div>;
  }

  return (
    <div className="space-y-6">
      

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Subscribers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.stats.newSubscribers == 0 ? 0 : `+${data.stats.newSubscribers}`}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.stats.unsubscribed == 0 ? 0 : `-${data.stats.unsubscribed}`}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.stats.activeSubscribers}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center justify-between space-y-0 pb-2'>
              <h2 className="text-xl font-bold">Active Subscribers</h2>
              {/* Broadcast Button */}
              <div className="flex justify-end">
                <Button onClick={() => setIsBroadcastModalOpen(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Broadcast
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.subscribers.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No active subscribers found.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {data.subscribers.map((subscriber) => (
                    <div
                      key={subscriber.subscription_id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{subscriber.subscription_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {subscriber.subscription_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(subscriber.subscription_created_at)}
                          </div>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(data.pagination.totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (data.pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= data.pagination.totalPages - 2) {
                          pageNum = data.pagination.totalPages - 4 + i;
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
                      onClick={() => setCurrentPage(Math.min(data.pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === data.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Broadcast Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        subscriberCount={data.stats.activeSubscribers}
      />
    </div>
  );
}