import { Resend } from "resend";
import { env } from "~/env.mjs";
import nodemailer from "nodemailer";
import { type EmailProps } from "~/types/types";
import { z } from "zod";

const resend = new Resend(env.RESEND_API_KEY); // Make sure RESEND_API_KEY is set and valid

const emailSchema = z.object({
  recipient: z.string().email(),
  link: z.string().url(),
  recipientUsername: z.string(),
  senderImage: z.string().optional().default(""),
  invitedByUsername: z.string(),
  invitedByEmail: z.string().email(),
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as EmailProps;
    const body = emailSchema.parse(json);

    await transporter.sendMail({
      from: `"Cambliss Meet" <${process.env.SMTP_USER}>`,
      to: body.recipient,
      subject: "Invitation to join a Cambliss Meet call",
      text: `Hi ${body.recipientUsername},\n\nYou’ve been invited to join a call on Cambliss Meet by ${body.invitedByUsername} (${body.invitedByEmail}).\n\nJoin here: ${body.link}\n\nBest,\nCambliss Meet Team`,
      // Optionally add HTML template here
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Failed to send email" }), { status: 500 });
  }
}
