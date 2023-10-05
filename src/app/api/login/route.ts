import { NextRequest, NextResponse } from "next/server";

import { sign } from "jsonwebtoken";
import { compareSync, hashSync } from "bcryptjs";

import { prismaClient } from "@/database/client";
import { loginUserFormSchema } from "@/validations/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedBody = loginUserFormSchema.safeParse(body)

  if(!parsedBody.success) {
    return NextResponse.json(parsedBody.error)
  }

  const { username, password } = parsedBody.data;

  if (!username || !password) {
    return NextResponse.json(
      { message: "username or password must be provided" },
      { status: 404 }
    );
  }

  const user = await prismaClient.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user || !compareSync(password, user.password)) {
    return NextResponse.json(
      { message: "Email ou senha incorretas" },
      { status: 404 }
    );
  }

  const accessToken = sign({ sub: user.id }, "SUPER_SECRET", {
    expiresIn: "1d",
  });

  await prismaClient.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  return NextResponse.json({
    accessToken,
    user: { ...user, password: undefined },
  });
}
