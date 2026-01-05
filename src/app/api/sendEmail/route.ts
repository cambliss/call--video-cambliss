import nodemailer from "nodemailer";
import { z } from "zod";
import { type EmailProps } from "~/types/types";

const emailSchema = z
  .object({
    recipient: z.string().email().optional(),
    recipients: z.array(z.string().email()).optional(),
    link: z.string().url(),
    recipientUsername: z.string().optional(),
    senderImage: z.string().optional().default(""),
    invitedByUsername: z.string(),
    invitedByEmail: z.string().email(),
    scheduledStartTime: z.string().datetime().optional(),
    scheduledTimeZone: z.string().optional(),
  })
  .refine(
    (data) => (data.recipient && !data.recipients) || data.recipients?.length,
    {
      message: "At least one recipient is required",
      path: ["recipients"],
    }
  );

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatScheduledTime(body: z.infer<typeof emailSchema>): string {
  if (!body.scheduledStartTime) return "Join anytime.";

  const date = new Date(body.scheduledStartTime);
  const timeZone = body.scheduledTimeZone || "UTC";

  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);

  return `Scheduled for ${formatted}`;
}

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as EmailProps;
    const body = emailSchema.parse(json);

    const recipients = body.recipients ?? (body.recipient ? [body.recipient] : []);
    if (!recipients.length) {
      return new Response(
        JSON.stringify({ success: false, error: "No recipients provided" }),
        { status: 400 }
      );
    }

    const scheduleText = formatScheduledTime(body);

    await Promise.all(
      recipients.map((recipient) => {
        const nameFromEmail = recipient.split("@")[0];
        return transporter.sendMail({
          from: `"Cambliss Meet" <${process.env.SMTP_USER}>`,
          to: recipient,
          subject: "Invitation to join a Cambliss Meet call",
          text: `Hi ${body.recipientUsername || nameFromEmail},\n\nYou’ve been invited to join a call on Cambliss Meet by ${body.invitedByUsername} (${body.invitedByEmail}).\n${scheduleText}\n\nJoin here: ${body.link}\n\nBest,\nCambliss Meet Team`,
        });
      })
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }),
      { status: 500 }
    );
  }
}
