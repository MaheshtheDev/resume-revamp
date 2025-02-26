import { z } from 'zod';

export const ResumeSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string().optional(),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
    })
  ),
  experience: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      date: z.string().optional(),
    })
  ),
  skillCategories: z.array(
    z.object({
      name: z.string(),
      skills: z.array(z.string()),
    })
  ),
});

export type Resume = z.infer<typeof ResumeSchema>;
