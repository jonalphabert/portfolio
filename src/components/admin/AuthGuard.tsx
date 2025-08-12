'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSetupAndAuth = async () => {
      try {
        const response = await fetch('/api/auth/check-setup');
        const { hasAdmin } = await response.json();

        if (!hasAdmin) {
          router.push('/setup');
          return;
        }

        const token = localStorage.getItem('jwt-token');

        if (!isAuthenticated || !token || isTokenExpired(token)) {
          logout();
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkSetupAndAuth();
  }, [isAuthenticated, logout, router]);

  if (isChecking || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
