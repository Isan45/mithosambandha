import { AiSuggestions } from '@/components/admin/ai-suggestions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function MatchmakingPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline mb-6 text-3xl font-bold">
        Matchmaking Tools
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            AI Match Suggestions
          </CardTitle>
          <CardDescription>
            Use our powerful AI to analyze approved profiles and find potential
            matches. The AI considers bios, preferences, and demographics to
            suggest compatible pairs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AiSuggestions />
        </CardContent>
      </Card>
    </div>
  );
}
