'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';

export default function SetupGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        if (isAuthenticated) {
          router.push('/admin');
          return;
        }

        const response = await fetch('/api/auth/check-setup');
        const { hasAdmin } = await response.json();

        if (hasAdmin) {
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Setup check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSetup();
  }, [isAuthenticated, router]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}