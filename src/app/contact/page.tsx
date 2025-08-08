import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            This is the contact page. Provide your contact details like email,
            phone number, or a contact form to allow users to get in touch.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
