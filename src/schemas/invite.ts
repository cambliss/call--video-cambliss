import { z } from 'zod';

export const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
