import { Metadata } from 'next';
import Sidebar from '@/components/admin/Sidebar';
import AuthGuard from '@/components/admin/AuthGuard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
  description: 'Admin dashboard for managing portfolio content',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className='bg-background min-h-screen'>
        <div className='flex'>
          <Sidebar />
          <main className='h-screen flex-1 overflow-auto'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
