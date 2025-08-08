import { ProfileForm } from '@/components/profile-form';

export default function JoinPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">
              Join Our Community
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Submit your profile for a chance to be featured. Our team
              carefully reviews every application.
            </p>
          </div>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
