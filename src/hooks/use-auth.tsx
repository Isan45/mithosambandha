
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

const PROTECTED_ROUTES = ['/dashboard', '/admin'];
const PUBLIC_ROUTES = ['/login', '/join'];
const ONBOARDING_ROUTES = '/onboarding';


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      const adminUID = process.env.NEXT_PUBLIC_ADMIN_UID;
      setIsAdmin(!!user && user.uid === adminUID);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAdminRoute = pathname.startsWith('/admin');
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTES);


    // If not logged in and trying to access a protected route
    if (!user && isProtectedRoute) {
      router.push('/login');
      return;
    }

    // If logged in and on a public route (like /login or /join)
    // or if the user tries to go back to onboarding after completing it
    if (user && (isPublicRoute || (isOnboardingRoute && user))) {
      // Don't redirect if they are in the middle of onboarding
      if (isOnboardingRoute) return;

      if (isPublicRoute) {
        router.push(isAdmin ? '/admin' : '/dashboard');
        return;
      }
      
      // If a non-admin tries to access an admin route
      if(isAdminRoute && !isAdmin) {
        router.push('/dashboard'); // or a "not authorized" page
        return;
      }
    }
  }, [user, loading, pathname, router, isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
