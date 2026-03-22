
'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase/client';
import { signOut } from 'firebase/auth';
import {
  LogOut,
  LayoutDashboard,
  Compass,
  Search,
  Settings,
  User,
  Menu,
  Languages,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import React from 'react';

export function Header() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Navbar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinkClasses = (path: string) =>
    cn(
      'flex items-center gap-2 text-muted-foreground hover:text-foreground',
      pathname === path && 'text-primary font-semibold'
    );

  const mobileNavLinkClasses = (path: string) =>
    cn(
      'flex items-center gap-2 p-4 text-lg text-foreground hover:bg-muted',
      pathname === path && 'bg-secondary font-semibold text-primary'
    );

  const UserNavLinks = () => (
    <>
      {isAdmin ? (
        <Button variant="ghost" asChild>
          <Link href="/admin" className={navLinkClasses('/admin')}>
            <LayoutDashboard /> {t('admin')}
          </Link>
        </Button>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link href="/dashboard" className={navLinkClasses('/dashboard')}>
              <LayoutDashboard /> {t('dashboard')}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link
              href="/onboarding/create-profile"
              className={navLinkClasses('/onboarding/create-profile')}
            >
              <User /> {t('profile')}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/discover" className={navLinkClasses('/discover')}>
              <Compass /> {t('discover')}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/search" className={navLinkClasses('/search')}>
              <Search /> {t('search')}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/settings" className={navLinkClasses('/settings')}>
              <Settings /> {t('settings')}
            </Link>
          </Button>
        </>
      )}
      <Button variant="ghost" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        {t('logout')}
      </Button>
    </>
  );

  const PublicNavLinks = () => (
    <>
      <Button variant="ghost" asChild>
        <Link href="/" className={navLinkClasses('/')}>
          {t('home')}
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/about" className={navLinkClasses('/about')}>
          {t('about')}
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/login" className={navLinkClasses('/login')}>
          {t('login')}
        </Link>
      </Button>
      <Button
        asChild
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Link href="/join">{t('join')}</Link>
      </Button>
    </>
  );

  const MobileUserNavLinks = () => (
    <>
      {isAdmin ? (
        <SheetClose asChild>
          <Link href="/admin" className={mobileNavLinkClasses('/admin')}>
            <LayoutDashboard /> {t('admin')}
          </Link>
        </SheetClose>
      ) : (
        <>
          <SheetClose asChild>
            <Link
              href="/dashboard"
              className={mobileNavLinkClasses('/dashboard')}
            >
              <LayoutDashboard /> {t('dashboard')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/onboarding/create-profile"
              className={mobileNavLinkClasses('/onboarding/create-profile')}
            >
              <User /> {t('profile')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/discover" className={mobileNavLinkClasses('/discover')}>
              <Compass /> {t('discover')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/search" className={mobileNavLinkClasses('/search')}>
              <Search /> {t('search')}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/settings" className={mobileNavLinkClasses('/settings')}>
              <Settings /> {t('settings')}
            </Link>
          </SheetClose>
        </>
      )}
      <SheetClose asChild>
        <button onClick={handleLogout} className={cn(mobileNavLinkClasses(''), 'w-full')}>
          <LogOut /> {t('logout')}
        </button>
      </SheetClose>
    </>
  );

  const MobilePublicNavLinks = () => (
    <>
      <SheetClose asChild>
        <Link href="/" className={mobileNavLinkClasses('/')}>
          {t('home')}
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link href="/about" className={mobileNavLinkClasses('/about')}>
          {t('about')}
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          href="/#how-it-works"
          className={mobileNavLinkClasses('/#how-it-works')}
        >
          {t('home')} {/* Fallback or add new key */}
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link href="/login" className={mobileNavLinkClasses('/login')}>
          {t('login')}
        </Link>
      </SheetClose>
       <SheetClose asChild>
        <Link href="/join" className={cn(mobileNavLinkClasses('/join'), 'bg-primary text-primary-foreground')}>
          {t('join')}
        </Link>
      </SheetClose>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href={user ? '/dashboard' : '/'}
          className="flex items-center gap-2"
        >
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/mitho-Sambandha-Logo-.avif?alt=media&token=3de63ad0-a01e-466c-8454-d04da7df9533"
            alt="Mitho Sambandha Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="hidden sm:inline font-headline text-2xl font-bold text-primary">
            Mitho Sambandha
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {user ? <UserNavLinks /> : <PublicNavLinks />}
          <div className="ml-2 border-l border-primary/10 pl-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Languages className="h-4 w-4" />
                  <span className="uppercase">{locale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.replace(pathname, { locale: 'en' })}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.replace(pathname, { locale: 'ne' })}>
                  नेपाली (Nepali)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col pt-8">
                {user ? <MobileUserNavLinks /> : <MobilePublicNavLinks />}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
