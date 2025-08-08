import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Select the plan that best suits your journey to finding a life
            partner. We offer flexible options to meet your needs.
          </p>
        </div>

        <Card className="mx-auto max-w-5xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-border">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-1/3 px-6 py-4 text-left font-headline text-lg text-foreground">
                      Feature
                    </TableHead>
                    <TableHead className="w-1/4 px-6 py-4 text-center font-headline text-lg text-foreground">
                      Free
                    </TableHead>
                    <TableHead className="w-1/4 px-6 py-4 text-center font-headline text-lg text-foreground">
                      Gold
                    </TableHead>
                    <TableHead className="relative w-1/4 border-l-2 border-primary bg-primary/10 px-6 py-4 text-center font-headline text-lg text-primary">
                       <div className="flex items-center justify-center gap-2">
                        <Star className="h-5 w-5 fill-primary" />
                        <span>Platinum</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border bg-background">
                  {/* Promotion for Ladies */}
                  <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      Promotion for Ladies
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Free 6 Month membership</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                       <div className="flex items-center justify-center gap-1 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Free 6 month membership</span>
                      </div>
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                       <div className="flex items-center justify-center gap-1 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Free 6 month membership</span>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* For Other Members */}
                  <TableRow className="bg-muted/30">
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      For Other Members
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-semibold text-foreground">
                      Free
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-semibold text-foreground">
                      ₹1000/month or ₹6000/year
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center font-semibold text-foreground">
                       ₹2500/month or ₹15000/year
                    </TableCell>
                  </TableRow>

                   {/* Profile Creation */}
                  <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                     Profile Creation
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                       <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>
                  
                   {/* Admin Verification */}
                  <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                     Admin Verification
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                       <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                        <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>

                   {/* View Profile Details */}
                  <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                     View Profile Details
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center text-muted-foreground">
                        Basic Details
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center text-foreground">
                       Full Details (with consent)
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center text-foreground">
                        Unlimited Full Details
                    </TableCell>
                  </TableRow>

                  {/* Contact and Chat with New Members */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      Contact and Chat with New Members
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center text-foreground">
                       Up to 10 new members per month
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center text-foreground">
                       Unlimited contacts and chats
                    </TableCell>
                  </TableRow>

                  {/* Direct Messaging */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      Direct Messaging
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center text-foreground">
                       Limited
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center text-foreground">
                       Unlimited
                    </TableCell>
                  </TableRow>

                   {/* View Contact Information */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      View Contact Information (Phone/Email)
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                       <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>

                   {/* Photo Requests */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      Photo Requests
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center text-foreground">
                       Unlimited requests
                    </TableCell>
                  </TableRow>
                  
                  {/* 24/7 Priority Support */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      24/7 Priority Support
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                       <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>

                  {/* Profile Visibility Boost */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      Profile Visibility Boost
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                       <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>

                  {/* Access to All Features */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      Access to All Features
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                       <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>

                   {/* Unlimited Admin Support */}
                   <TableRow>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      Unlimited Admin Support
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        <XCircle className="mx-auto h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                       <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>

                  {/* Upgrade Buttons */}
                  <TableRow>
                    <TableCell className="px-6 py-4"></TableCell>
                    <TableCell className="px-6 py-4 text-center">
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Button asChild>
                        <Link href="/join">Upgrade Now</Link>
                      </Button>
                    </TableCell>
                    <TableCell className="bg-primary/5 px-6 py-4 text-center">
                      <Button asChild>
                        <Link href="/join">Upgrade Now</Link>
                      </Button>
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
