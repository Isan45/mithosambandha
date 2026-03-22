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
  id: z.string().describe('The UID of the user.'),
  name: z.string().describe('The name of the user.'),
  gender: z.string().describe('The gender of the user.'),
  age: z.number().describe('The age of the user.'),
  location: z.string().describe('Current location.'),
  bio: z.string().describe('User biography.'),
  education: z.string().optional().describe('Highest education/college.'),
  profession: z.string().optional().describe('Current job/profession.'),
  visaStatus: z.string().optional().describe('Visa status (e.g. PR, Student, Citizen).'),
  astrology: z.object({
    rashi: z.string().optional(),
    nakshatra: z.string().optional(),
    manglik: z.string().optional(),
  }).optional().describe('Astrological details for compatibility.'),
  partnerPreferences: z.string().describe('Stated partner preferences.'),
});

const SuggestMatchesInputSchema = z.array(ProfileSchema).describe('An array of user profiles to analyze for match suggestions.');
export type SuggestMatchesInput = z.infer<typeof SuggestMatchesInputSchema>;

const MatchSuggestionSchema = z.object({
  profile1Id: z.string().describe('The ID of the first profile.'),
  profile1Name: z.string().describe('The name of the first profile.'),
  profile2Id: z.string().describe('The ID of the second profile.'),
  profile2Name: z.string().describe('The name of the second profile.'),
  reason: z.string().describe('The AI explanation for the match.'),
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
- ID: {{id}}
- Name: {{name}}
- Gender: {{gender}}
- Age: {{age}}
- Location: {{location}}
- Education: {{education}}
- Profession: {{profession}}
- Visa Status: {{visaStatus}}
- Bio: {{bio}}
- Preferences: {{partnerPreferences}}
\n
{{/each}}

Suggest potential matches based on:
1. **Mobility Compatibility**: Prioritize matches with low immigration friction (e.g., USA Citizen + USA Green Card is HIGH, while UAE + Canada PR is LOW due to logistics).
2. **Astrology**: Use Rashi and Nakshatra if available. If birth time is unknown, use "General Alignment" (High/Medium/Low) based on available signs.
3. **Core Factors**: Shared interests, compatible age ranges, and complementary professions.

Explain your reasoning for each suggested match, specifically mentioning why their Mobility and Astrology factors are compatible. Format your output as a JSON array where each object contains profile1Id, profile1Name, profile2Id, profile2Name, and reason fields. Only suggest matches between a male and a female. If no matches are found, return an empty array.
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
