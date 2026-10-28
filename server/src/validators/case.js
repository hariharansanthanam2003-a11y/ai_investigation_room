import { z } from 'zod';
export const createCaseSchema = z.object({ scenario: z.string().trim().min(50).max(2000), difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'), setting: z.string().max(120).optional().default(''), category: z.string().max(80).optional().default(''), evidenceTypes: z.array(z.enum(['chat', 'image', 'cctv', 'document'])).max(4).optional().default([]) });
export const accusationSchema = z.object({ suspectId: z.string().min(1).max(100) });
