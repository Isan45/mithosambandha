'use client';

import { useState } from 'react';
import {
  suggestMatches,
  type SuggestMatchesOutput,
} from '@/ai/flows/suggest-matches';
import { mockProfiles } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';

// Server action to call the AI flow
async function getAiSuggestions() {
  'use server';
  const approvedProfiles = mockProfiles.filter(p => p.status === 'approved');
  const result = await suggestMatches(approvedProfiles);
  return result;
}

export function AiSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestMatchesOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAiSuggestions();
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <Button onClick={handleGenerate} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate AI Match Suggestions
            </>
          )}
        </Button>
      </div>

      {error && <p className="mt-4 text-center text-destructive">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="font-headline text-center text-2xl">
            Suggested Matches
          </h3>
          {suggestions.map((match, index) => (
            <Card key={index} className="bg-secondary">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">
                  {match.profile1} &amp; {match.profile2}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Reasoning:
                    </span>{' '}
                    {match.reason}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
