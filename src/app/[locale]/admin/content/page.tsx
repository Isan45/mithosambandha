import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContentPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Content Management (CMS)
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain tools to manage blog posts, success stories, static pages (About, Terms), and moderate user-generated content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
