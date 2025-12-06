import { z } from "zod";

export const joinCallFormSchema = z.object({
  name: z.string().optional(),
  meetingLink: z
    .string()
    .min(1, "A meeting link or ID is required")
    .refine((value) => {
      return (
        value.trim().length > 0 &&
        /https?:\/\//.test(value) || /^[a-zA-Z0-9-]+$/.test(value)
      );
    }, "Enter a valid meeting link or meeting ID"),
});
