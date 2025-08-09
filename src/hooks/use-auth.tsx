
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false, profileStatus: null });

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/discover', '/search', '/settings'];
const PUBLIC_ROUTES = ['/login', '/join'];
const ONBOARDING_PREFIX = '/onboarding';


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileStatus, setProfileStatus] = useState<UserProfile['profileStatus'] | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const adminUID = process.env.NEXT_PUBLIC_ADMIN_UID;
        const isUserAdmin = user.uid === adminUID || user.email === 'admin@mithosambandha.com';
        setIsAdmin(isUserAdmin);
        
        // Fetch profile status only if not an admin
        if (!isUserAdmin) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfileStatus(userDoc.data().profileStatus || 'incomplete');
          } else {
            setProfileStatus('incomplete');
          }
        } else {
            setProfileStatus(null); // Admin does not need a profile status
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
    const isAdminRoute = pathname.startsWith('/admin');
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isOnboardingRoute = pathname.startsWith(ONBOARDING_PREFIX);
    
    // If not logged in and trying to access a protected route
    if (!user && isProtectedRoute) {
      router.push('/login');
      return;
    }

    if(user) {
        // If it's an admin user
        if (isAdmin) {
            if (!isAdminRoute) {
                router.push('/admin');
            }
            return; // Skip all other routing logic for admin
        }

      // --- Regular User Logic ---

      // Redirect from public routes if logged in
      if(isPublicRoute) {
        router.push('/dashboard');
        return;
      }
      
      const validCompletedStatuses = ['pending-review', 'approved', 'rejected'];
      
      // Handle onboarding redirection logic for non-admin users
      if (!isOnboardingRoute && profileStatus && !validCompletedStatuses.includes(profileStatus)) {
          const stepMap: {[key: string]: string} = {
              'incomplete': '/onboarding/create-profile',
              'in-progress-education': '/onboarding/education',
              'in-progress-career': '/onboarding/career',
              'in-progress-partner-preferences': '/onboarding/partner-preferences',
              'in-progress-photos': '/onboarding/photos',
          };
          
          const nextStep = stepMap[profileStatus];

          if(nextStep) {
            router.push(nextStep);
            return;
          }
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
    <AuthContext.Provider value={{ user, loading, isAdmin, profileStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
