import { NextRequest, NextResponse } from "next/server";

import { sign } from "jsonwebtoken";
import { compareSync, hashSync } from "bcryptjs";

import { prismaClient } from "@/database/client";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

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
