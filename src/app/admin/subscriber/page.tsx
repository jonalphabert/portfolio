import { SubscriberDashboard } from '@/components/admin/subscriber/subscriber-dashboard';

export default function AdminSubscriberPage() {
  return (
    <section className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscribers</h1>
          <p className="text-muted-foreground">Manage your newsletter subscribers</p>
        </div>
        
        <SubscriberDashboard />
      </div>
    </section>
  );
}