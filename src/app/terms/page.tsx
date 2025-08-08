import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            This is the Terms of Service page. Clearly define the rules and
            guidelines for using your platform.
          </p>
          <h3 className="font-headline text-2xl">User Conduct</h3>
          <p className="text-muted-foreground">
            Outline acceptable user behavior, emphasizing the importance of
            providing truthful information and treating others with respect.
          </p>
          <h3 className="font-headline text-2xl">Our Role</h3>
          <p className="text-muted-foreground">
            Clarify your role as a facilitator of introductions and that you are
            not responsible for the outcomes of matches.
          </p>
          <h3 className="font-headline text-2xl">Profile Approval</h3>
          <p className="text-muted-foreground">
            State that you reserve the right to approve, reject, or remove
            profiles that do not meet your community standards.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
