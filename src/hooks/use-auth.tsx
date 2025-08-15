
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profileStatus: UserProfile['profileStatus'] | null;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false, profileStatus: null, getIdToken: async () => null });

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/discover', '/search', '/settings', '/onboarding'];
const PUBLIC_ONLY_ROUTES = ['/login', '/join'];

// This now maps profile statuses that require onboarding to the single profile creation page.
const ONBOARDING_REQUIRED_STATUSES = [
    'incomplete',
    'in-progress-education',
    'in-progress-career',
    'in-progress-partner-preferences',
    'in-progress-photos',
];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileStatus, setProfileStatus] = useState<UserProfile['profileStatus'] | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const getIdToken = useCallback(async () => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const adminUID = process.env.NEXT_PUBLIC_ADMIN_UID;
        const isUserAdmin = user.uid === adminUID || user.email === 'admin@mithosambandha.com';
        setIsAdmin(isUserAdmin);
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            setProfileStatus(userDoc.data().profileStatus || 'incomplete');
        } else {
            setProfileStatus('incomplete'); // New user who hasn't had a doc created yet
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setProfileStatus(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.includes(pathname);
    const isAdminRoute = pathname.startsWith('/admin');
    
    if (!user && isProtectedRoute) {
      router.push('/login');
      return;
    }

    if(user) {
        if(isPublicOnlyRoute) {
            router.push('/dashboard');
            return;
        }

        if (isAdmin) {
            if (!isAdminRoute) {
                router.push('/admin');
            }
            return;
        }
        
        // If profile status requires onboarding and user is not on the profile creation page, redirect them.
        if (profileStatus && ONBOARDING_REQUIRED_STATUSES.includes(profileStatus) && !pathname.startsWith('/onboarding')) {
             router.push('/onboarding/create-profile');
             return;
        }
    }

  }, [user, loading, pathname, router, isAdmin, profileStatus]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, profileStatus, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
