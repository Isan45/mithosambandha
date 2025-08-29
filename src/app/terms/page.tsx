import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="font-headline text-4xl">
            Terms of Service
          </CardTitle>
          <p className="pt-2 text-sm text-muted-foreground">
            Effective Date:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            Welcome to Mitho Sambandha ("we," "us," or "our"), a matrimonial
            platform dedicated to the global Nepali community. These Terms of
            Service ("Terms") govern your use of our website and services. By
            accessing or using our services, you agree to be bound by these
            Terms.
          </p>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              1. Acceptance of Terms
            </h3>
            <p>
              By creating a profile, submitting content, or using the Mitho
              Sambandha website, you acknowledge that you have read, understood,
              and agree to these Terms and our Privacy Policy. If you do not
              agree with these Terms, you must not use our services.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              2. Eligibility
            </h3>
            <p>
              You must be at least 18 years of age and legally eligible to enter
              into a marriage to use this service. By using the platform, you
              represent and warrant that you meet these eligibility
              requirements.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              3. User Responsibilities
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Accurate Information:</strong> You are responsible for
                ensuring that all information you provide, including profile
                details and photographs, is accurate, truthful, and up-to-date.
              </li>
              <li>
                <strong>Verification:</strong> You agree to cooperate with our
                admin team's verification process, which may include submitting
                a form of government-issued ID.
              </li>
              <li>
                <strong>Confidentiality:</strong> You must not share any
                personal or confidential information of other users with third
                parties without their explicit consent.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              4. Our Admin-Driven Model
            </h3>
            <p>
              You acknowledge and agree that Mitho Sambandha operates on an
              admin-driven model. Our admin team has the sole discretion to:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Review and Approve Profiles:</strong> All profile
                submissions are subject to manual review and approval. We
                reserve the right to reject any profile for any reason,
                including but not limited to, a lack of accurate information,
                inappropriate content, or failure to meet our standards.
              </li>
              <li>
                <strong>Matchmaking:</strong> Our platform facilitates connections based on the information provided. While we suggest matches, the ultimate decision to connect and communicate rests with the users.
              </li>
              <li>
                <strong>Content Moderation:</strong> We reserve the right to
                edit, remove, or request changes to any content you submit to
                ensure it aligns with our community standards.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              5. Prohibited Conduct
            </h3>
            <p>
              You agree not to engage in any of the following prohibited
              activities:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Submitting false, misleading, or fraudulent information.</li>
              <li>
                Harassing, threatening, or impersonating other users or our
                staff.
              </li>
              <li>
                Posting sexually explicit, defamatory, or offensive content.
              </li>
              <li>
                Using the platform for any illegal purpose or to violate any
                laws.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              6. Disclaimers
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>No Guarantees:</strong> Mitho Sambandha does not
                guarantee that you will find a partner or that the information
                on other profiles is completely accurate, despite our best
                efforts at verification.
              </li>
              <li>
                <strong>As-Is Service:</strong> Our services are provided on an
                "as-is" and "as-available" basis without any warranties of any
                kind, whether express or implied.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              7. Limitation of Liability
            </h3>
            <p>
              To the fullest extent permitted by law, Mitho Sambandha and its
              affiliates shall not be liable for any direct, indirect,
              incidental, special, or consequential damages resulting from your
              use of the service.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              8. Intellectual Property
            </h3>
            <p>
              You grant Mitho Sambandha a worldwide, non-exclusive, royalty-free
              license to use, reproduce, and display the content you submit to
              the platform for the purpose of operating and promoting the
              service.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              9. Termination
            </h3>
            <p>
              We reserve the right to terminate your access to the service at
              our sole discretion, without notice, if we believe you have
              violated these Terms.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              10. Governing Law
            </h3>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Nepal, without regard to its conflict
              of law provisions.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-headline text-2xl text-foreground">
              11. Contact Information
            </h3>
            <p>
              If you have any questions about these Terms, please contact us at: info@mithosambandha.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
