// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-powered match suggestion flow.
 *
 * This file defines a Genkit flow that analyzes user profiles and preferences
 * to suggest potential matches to administrators.
 *
 * @requires genkit
 * @requires zod
 *
 * @exports suggestMatches - The main function to trigger the match suggestion flow.
 * @exports SuggestMatchesInput - The input type for the suggestMatches function.
 * @exports SuggestMatchesOutput - The output type for the suggestMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileSchema = z.object({
  name: z.string().describe('The name of the user.'),
  age: z.number().describe('The age of the user.'),
  location: z.string().describe('The location of the user.'),
  bio: z.string().describe('A detailed biography of the user.'),
  partnerPreferences: z.string().describe('The stated partner preferences of the user.'),
});

const SuggestMatchesInputSchema = z.array(ProfileSchema).describe('An array of user profiles to analyze for match suggestions.');
export type SuggestMatchesInput = z.infer<typeof SuggestMatchesInputSchema>;

const MatchSuggestionSchema = z.object({
  profile1: z.string().describe('The name of the first profile in the match.'),
  profile2: z.string().describe('The name of the second profile in the match.'),
  reason: z.string().describe('The AI explanation for why these profiles are a good match.'),
});

const SuggestMatchesOutputSchema = z.array(MatchSuggestionSchema).describe('An array of suggested matches with reasons.');
export type SuggestMatchesOutput = z.infer<typeof SuggestMatchesOutputSchema>;

export async function suggestMatches(input: SuggestMatchesInput): Promise<SuggestMatchesOutput> {
  return suggestMatchesFlow(input);
}

const suggestMatchesPrompt = ai.definePrompt({
  name: 'suggestMatchesPrompt',
  input: {schema: SuggestMatchesInputSchema},
  output: {schema: SuggestMatchesOutputSchema},
  prompt: `You are an expert matchmaker for a Nepali matrimonial service. Given the following list of user profiles, analyze their bios and partner preferences and suggest potential matches.

Profiles:
{{#each this}}
Name: {{name}}
Age: {{age}}
Location: {{location}}
Bio: {{bio}}
Preferences: {{partnerPreferences}}
\n
{{/each}}

Suggest potential matches based on shared interests, compatible preferences, and complementary backgrounds. Explain your reasoning for each suggested match.

Format your output as a JSON array of objects, where each object contains profile1, profile2, and reason fields. Only suggest matches between a male and a female. Do not suggest same-gender matches. If you cannot find any suitable matches, return an empty array.
`,
});

const suggestMatchesFlow = ai.defineFlow(
  {
    name: 'suggestMatchesFlow',
    inputSchema: SuggestMatchesInputSchema,
    outputSchema: SuggestMatchesOutputSchema,
  },
  async input => {
    const {output} = await suggestMatchesPrompt(input);
    return output!;
  }
);
