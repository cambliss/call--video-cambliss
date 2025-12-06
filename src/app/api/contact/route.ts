import { Resend } from "resend";
import { env } from "~/env.mjs";
import { z } from "zod";

const resend = new Resend(env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(5, "Message should be at least 5 characters"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = contactSchema.parse(json);

    const htmlBody = `
      <h2>New Cambliss Meet Contact Form Submission</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Message:</strong></p>
      <p>${body.message.replace(/\n/g, "<br/>")}</p>
    `;

    const { error } = await resend.emails.send({
      from: "Cambliss Meet <no-reply@camblissstudio.com>",
      to: "contact@camblissstudio.com",
      subject: "New Contact Form Enquiry - Cambliss Meet",
      html: htmlBody,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
    });

    if (error) {
      console.error(error);
      return new Response("Failed to send contact email", { status: 500 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.errors[0]?.message ?? "Invalid data", {
        status: 400,
      });
    }
    return new Response("Something went wrong", { status: 500 });
  }
}
