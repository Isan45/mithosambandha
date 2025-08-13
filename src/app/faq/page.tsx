import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Mitho Sambandha, our process, and our policies.',
};

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-headline mb-8 text-center text-4xl font-bold">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-headline text-lg">
              How does the matching process work?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              Our dedicated admin team carefully reviews each profile. Based on
              your preferences and bio, we manually search for potential
              matches and suggest them to you. It's a personal touch to ensure
              quality connections.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-headline text-lg">
              Is my information kept private?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              Absolutely. We prioritize your privacy and security. Your detailed
              information is only visible to our trusted admin team. Only approved
              profiles with limited information are visible publicly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-headline text-lg">
              What are the requirements to join?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              We welcome individuals from the Nepali community who are serious
              about finding a life partner. You must be at least 18 years old
              and provide genuine information and high-quality photos for your
              profile.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
