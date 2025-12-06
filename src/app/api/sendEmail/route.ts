import { Resend } from "resend";
import { env } from "~/env.mjs";
import { type EmailProps } from "~/types/types";
import { z } from "zod";
import { InviteEmail } from "~/components/email-template";
import { type ErrorResponse } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

const emailSchema = z.object({
  recipient: z.string().email(),
  link: z.string().url(),
  recipientUsername: z.string(),
  senderImage: z.string().optional().default(""),
  invitedByUsername: z.string(),
  invitedByEmail: z.string().email(),
});

export async function POST(req: Request) {
  const json = (await req.json()) as EmailProps;
  const body = emailSchema.parse(json);

  try {
    const { error } = await resend.emails.send({
      // ✅ Use a verified sender here
      from: `Cambliss Meet <no-reply@cambliss.com>`,
      to: body.recipient,
      subject: "Invitation to join a Cambliss Meet call",
      react: InviteEmail({
        recipientUsername: body.recipientUsername,
        senderImage: body.senderImage,
        invitedByUsername: body.invitedByUsername,
        invitedByEmail: body.invitedByEmail,
        inviteLink: body.link,
      }),
      text: "You’ve been invited to join a call on Cambliss Meet.",
    });

    if (error) {
      console.log(error);
      return new Response(error.message, { status: 500 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    const resendError = error as ErrorResponse;

    if (resendError?.message) {
      return new Response(resendError.message, { status: 429 });
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
