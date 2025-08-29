import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Mitho Sambandha team. We are here to help you on your journey.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
       <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            We're here to help you on your journey. Whether you have a question, feedback, or a success story to share, we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                 <h2 className="font-headline text-2xl mb-4">Contact Information</h2>
                 <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:info@mithosambandha.com" className="hover:underline">info@mithosambandha.com</a>
                    </div>
                     <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>+977 980-0000000</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>Kathmandu, Nepal</span>
                    </div>
                 </div>
                 <div className="mt-8">
                     <h3 className="font-headline text-xl mb-2">Office Hours</h3>
                     <p className="text-muted-foreground">Sunday - Friday: 10:00 AM - 6:00 PM (NPT)</p>
                 </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your.email@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g. Profile Inquiry" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
