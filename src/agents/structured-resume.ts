import { tryCatch } from '@/lib/utils';
import { Resume, ResumeSchema } from '@/types';
import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

export async function structuredResume(content: string) {
  const result = await generateObject({
    model: google('gemini-1.5-flash-latest'),
    system: `
    You are a resume parser.
    You will be given a resume and you will need to parse it into a structured format.
    User will provide you with a resume and you will need to parse it into a structured format.
    `,
    messages: [
      {
        role: 'user',
        content: content,
      },
    ],
    schema: ResumeSchema,
  });
  return result;
}

export async function revampResume(
  resume: Resume,
  message: string,
  jobUrl: string
) {
  const { data: jobPortalContent, error: jobPortalError } = await tryCatch(
    getJobDescription(jobUrl)
  );
  if (jobPortalError) {
    console.error(jobPortalError);
  }

  const jobDescriptionResult = await generateText({
    model: google('gemini-1.5-flash-latest'),
    system: `
    You are a job description parser.
    You will be given a job portal content and you will need to extract the job description from it and requirements from it that are relevant to the resume.
    `,
    messages: [
      {
        role: 'user',
        content: jobPortalContent || '',
      },
    ],
  });

  const jobDescription = jobDescriptionResult.text;
  console.log(jobDescription);

  const result = await generateObject({
    model: google('gemini-1.5-flash-latest'),
    system: `
    You are a resume revamp agent.
    You will be given a resume and a message from the user requesting changes.
    Your task is to update the resume based on the user's request.

    Guidelines:
    - If the user asks for specific changes, implement them precisely.
    - If the request is general, use your expertise to make appropriate improvements.
    - Make thoughtful, professional improvements that align with the user's goals.
    - Maintain the same structure but enhance the content as requested.
    - for each experience
      - create 3-5 concise bullet points and take the experience duration into account (max 1-2 lines each) that are directly relevant to the job description.
      - keep each bullet point focused on a single accomplishment or responsibility.
      - use quantifiable metrics and results where possible.
    - don't go too much away from the original content, only make changes that are relevant to the job description.

    Job Description:
    ${jobDescription}
    `,
    messages: [
      {
        role: 'user',
        content: `Here is my current resume: ${JSON.stringify(resume, null, 2)}`,
      },
      {
        role: 'user',
        content: `Please update my resume with the following request: ${message}`,
      },
    ],
    schema: z.object({
      resume: ResumeSchema,
      message: z
        .string()
        .describe(
          'The message from the user on highlighting the changes that made to the resume, and share what exactly was changed in the resume or added to the resume'
        ),
    }),
  });
  return result;
}

async function getJobDescription(jobUrl: string) {
  const mdServiceUrl = 'https://md.dhr.wtf/?url=' + encodeURIComponent(jobUrl);
  console.log('---mdServiceUrl---');
  console.log(mdServiceUrl);
  const mdContent = await fetch(mdServiceUrl).then((res) => res.text());
  console.log('---mdContent---');
  console.log(mdContent);
  return mdContent;
}
