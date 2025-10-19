'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '../app/(dashboard)/loading';
import { authService } from '../lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return <Loading />;
  }

  return <>{children}</>;
}
