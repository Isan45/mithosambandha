import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="font-headline text-4xl">
            Privacy Policy
          </CardTitle>
          <p className="pt-2 text-sm text-muted-foreground">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            This Privacy Policy describes how Mitho Sambandha ("we," "us," or
            "our") collects, uses, and protects the personal information of our
            users ("you"). By using our website, you agree to the terms of this
            policy.
          </p>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              1. Information We Collect
            </h3>
            <p>
              We collect personal information that you voluntarily provide to us
              when you create a profile, submit information for review, or
              contact us. This includes:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Identity Information:</strong> Name, age, location, and a form
                of government-issued ID (such as a passport or driver's
                license).
              </li>
              <li>
                <strong>Profile Details:</strong> Photos, personal descriptions, bio,
                and partner preferences.
              </li>
              <li>
                <strong>Contact Information:</strong> Email address and phone number.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with
                our website, such as pages viewed and time spent on the site.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              2. How We Use Your Information
            </h3>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>To Verify Identity:</strong> We collect government-issued IDs
                to verify the identity of our members and maintain a
                trustworthy platform. IDs are deleted immediately after the
                verification process is complete.
              </li>
              <li>
                <strong>To Create and Manage Profiles:</strong> We use your name, age,
                photos, bio, and preferences to create and manage your profile
                on our platform, which is then reviewed and approved by our
                admin team.
              </li>
              <li>
                <strong>For Matchmaking:</strong> Your profile details are used by our
                admin team to facilitate the matchmaking process and find
                suitable partners for you.
              </li>
              <li>
                <strong>For Marketing:</strong> With your consent, we may use your
                profile information (photos, and general profile details) for
                marketing and promotional purposes to showcase our community.
              </li>
              <li>
                <strong>Third-Party Marketing:</strong> We may use your email and
                phone number for our own marketing purposes, and we may also
                share this information with trusted third-party partners for
                their marketing purposes.
              </li>
              <li>
                <strong>To Maintain the Service:</strong> We use your contact
                information to communicate with you about your profile, matches,
                and to send important updates about the service.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              3. Data Retention
            </h3>
            <p>
              We retain your personal information for as long as your profile is
              active on our website. You have the right to request the deletion
              of your profile at any time, which will result in the permanent
              removal of your data from our systems.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              4. Data Security
            </h3>
            <p>
              We are committed to protecting your personal information. We have
              implemented security measures to prevent unauthorized access,
              disclosure, alteration, and destruction of your data. However,
              please be aware that no method of transmission over the internet
              or electronic storage is 100% secure.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              5. Your Rights
            </h3>
            <p>You have the right to:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Access:</strong> Request a copy of the personal data we hold
                about you.
              </li>
              <li>
                <strong>Rectify:</strong> Request that we correct any inaccurate or
                incomplete information.
              </li>
              <li>
                <strong>Erase:</strong> Request the deletion of your personal data
                from our systems.
              </li>
              <li>
                <strong>Object:</strong> Object to the processing of your data for
                specific purposes, such as marketing.
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at info@mithosambandha.com.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              6. Changes to this Privacy Policy
            </h3>
            <p>
              We reserve the right to update this Privacy Policy at any time. We
              will notify you of any changes by posting the new policy on this
              page. Your continued use of the service after any changes
              constitutes your acceptance of the new policy.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at: info@mithosambandha.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}