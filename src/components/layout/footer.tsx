import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-foreground">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">
                Mitho Sambandha
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The most trusted matrimonial platform for the Nepali community
              worldwide.
            </p>
          </div>
          <div className="col-span-1 md:col-start-2">
            <h3 className="font-headline text-lg font-semibold text-primary">
              Mitho Sambandha
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-sm hover:underline">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary">
              For Members
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#featured" className="text-sm hover:underline">
                  New Members
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mitho Sambandha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
