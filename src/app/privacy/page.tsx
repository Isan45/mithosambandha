import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            This is the Privacy Policy page. It's crucial to outline how you
            collect, use, and protect user data.
          </p>
          <h3 className="font-headline text-2xl">Information We Collect</h3>
          <p className="text-muted-foreground">
            Detail the types of personal information you collect from users, such
            as name, age, contact details, photos, and personal descriptions.
          </p>
          <h3 className="font-headline text-2xl">How We Use Information</h3>
          <p className="text-muted-foreground">
            Explain that the information is used for matchmaking purposes by the
            admin team, to create profiles, and to contact users.
          </p>
          <h3 className="font-headline text-2xl">Data Security</h3>
          <p className="text-muted-foreground">
            Describe the measures you take to protect user data from unauthorized
            access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
