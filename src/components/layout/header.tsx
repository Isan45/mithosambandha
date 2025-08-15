
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase/client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Compass, Search, Settings, Gem, User, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinkClasses = (path: string) =>
    cn(
      'flex items-center gap-2',
      'text-muted-foreground hover:text-foreground',
      pathname === path && 'text-primary font-semibold'
    );

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/mitho-Sambandha-Logo-.avif?alt=media&token=3de63ad0-a01e-466c-8454-d04da7df9533"
            alt="Mitho Sambandha Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-headline text-2xl font-bold text-primary">
            Mitho Sambandha
          </span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {isAdmin ? (
                 <Button variant="ghost" asChild>
                    <Link href="/admin" className={navLinkClasses('/admin')}>
                      <LayoutDashboard /> Admin Dashboard
                    </Link>
                  </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard" className={navLinkClasses('/dashboard')}>
                      <LayoutDashboard /> Dashboard
                    </Link>
                  </Button>
                   <Button variant="ghost" asChild>
                    <Link href="/onboarding/create-profile" className={navLinkClasses('/onboarding/create-profile')}>
                      <User/> My Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/discover" className={navLinkClasses('/discover')}>
                      <Compass /> Discover
                    </Link>
                  </Button>
                   <Button variant="ghost" asChild>
                    <Link href="/search" className={navLinkClasses('/search')}>
                      <Search/> Search
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/settings" className={navLinkClasses('/settings')}>
                      <Settings/> Settings
                    </Link>
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/" className={navLinkClasses('/')}>Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                 <Link href="/about" className={navLinkClasses('/about')}>About</Link>
              </Button>
               <Button variant="ghost" asChild>
                 <Link href="/#how-it-works" className={navLinkClasses('/#how-it-works')}>How It Works</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login" className={navLinkClasses('/login')}>Login</Link>
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/join">Join Free</Link>
              </Button>
            </>
          )}
        </nav>
        {/* Add a mobile menu trigger here if needed in the future */}
      </div>
    </header>
  );
}
