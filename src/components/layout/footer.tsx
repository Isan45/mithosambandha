import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">
              Mitho Sambandha
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/" className="text-sm hover:underline">
              Contact
            </Link>
            <Link href="/" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="/" className="text-sm hover:underline">
              Privacy Policy
            </Link>
          </nav>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            © {new Date().getFullYear()} Mitho Sambandha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
