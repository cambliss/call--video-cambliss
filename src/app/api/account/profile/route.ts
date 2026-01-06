import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return new Response("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
        phone: phone || null,
      },
    });

    return Response.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
