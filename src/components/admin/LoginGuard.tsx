'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';

export default function LoginGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        if (isAuthenticated) {
          router.push('/admin');
          return;
        }

        const response = await fetch('/api/auth/check-setup');
        const { hasAdmin } = await response.json();

        if (!hasAdmin) {
          router.push('/setup');
          return;
        }

        setShouldRender(true);
      } catch (error) {
        console.error('Login check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkLogin();
  }, [isAuthenticated, router]);

  if (isChecking || !shouldRender) {
    return null;
  }

  return <>{children}</>;
}
