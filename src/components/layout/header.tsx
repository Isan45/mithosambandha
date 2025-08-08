
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase/client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Compass } from 'lucide-react';
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
      pathname === path && 'text-primary font-semibold'
    );

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
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
              <Button variant="ghost" asChild>
                <Link
                  href="/discover"
                  className={navLinkClasses('/discover')}
                >
                  <Compass className="mr-2 h-4 w-4" />
                  Discover
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className={navLinkClasses(
                    isAdmin ? '/admin' : '/dashboard'
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/join">Join Now</Link>
              </Button>
            </>
          )}
        </nav>
        {/* Add a mobile menu trigger here if needed in the future */}
      </div>
    </header>
  );
}
