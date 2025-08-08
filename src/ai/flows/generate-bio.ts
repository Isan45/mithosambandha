
'use server';
/**
 * @fileOverview An AI flow to generate a user profile bio.
 *
 * - generateBio - A function that generates a bio based on user details.
 * - GenerateBioInput - The input type for the generateBio function.
 * - GenerateBioOutput - The return type for the generateBio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBioInputSchema = z.object({
  gender: z.string().describe('The gender of the user.'),
  age: z.number().describe('The age of the user.'),
  location: z.string().describe('The current location of the user.'),
  education: z.string().optional().describe("The user's highest level of education."),
  profession: z.string().optional().describe("The user's profession."),
});
export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

const GenerateBioOutputSchema = z.object({
  bio: z.string().describe('The generated profile bio, written in the first person.'),
});
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}

const generateBioPrompt = ai.definePrompt({
  name: 'generateBioPrompt',
  input: { schema: GenerateBioInputSchema },
  output: { schema: GenerateBioOutputSchema },
  prompt: `
    You are an expert profile writer for a matrimonial service for the Nepali community.
    Your task is to write a warm, friendly, and engaging bio for a user based on the details they provide.
    The bio should be in the first person and sound natural. It should be around 3-4 sentences long.

    Here are the user's details:
    - Gender: {{{gender}}}
    - Age: {{{age}}}
    - Location: {{{location}}}
    - Education: {{{education}}}
    - Profession: {{{profession}}}

    Combine these details into a compelling paragraph. Start by introducing the user's profession, mention their location, and weave in their background.
    For example: "I'm a [age]-year-old [profession] based in [location]. I completed my [education] and am passionate about my work..."
    
    Do not invent hobbies or personality traits. Stick to the information provided.
    Generate only the 'bio' field in your JSON output.
  `,
});


const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    const { output } = await generateBioPrompt(input);
    return output!;
  }
);

    