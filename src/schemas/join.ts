import { z } from 'zod';

export const joinSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string()
    .min(1, "Meeting link or ID is required")
    .refine((value) => {
      return (
        value.trim().length > 0 &&
        /https?:\/\//.test(value) || /^[a-zA-Z0-9-]+$/.test(value)
      );
    }, "Enter a valid meeting link or meeting ID"),
});

export const previewJoinSchema = z.object({
    name: z.string().refine((val) => val.length > 0, {
        message: 'Name is required',
    })
});