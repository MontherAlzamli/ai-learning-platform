import { hash } from "bcryptjs";

import { prisma } from "@/lib/db/prisma";
import { signupSchema } from "@/lib/auth/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = signupSchema.safeParse(body);

    if (!parsedBody.success) {
      return Response.json(
        {
          error: "Please provide a valid name, email address, and password.",
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedBody.data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        {
          error: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Signup failed:", error);

    return Response.json(
      {
        error: "Unable to create your account right now.",
      },
      { status: 500 }
    );
  }
}
