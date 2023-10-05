import { JsonWebTokenError, verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { prismaClient } from "@/database/client";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });
  }
  try {
    const { sub: userId } = verify(token, "SUPER_SECRET") as unknown as {
      sub: string;
    };
    if (!userId) {
      return NextResponse.json({ message: "Invalid User" }, { status: 401 });
    }

    const user = await prismaClient.user.findFirst({
      where: {
        id: userId 
      },
      select: {
        id: true,
        fac: true,
        nameRP: true,
        blocked: true,
        confirmed: true,
        provider: true,
        username: true,
        rpNumber: true
      }
    });

    if(!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof JsonWebTokenError)
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    else
      return NextResponse.json({ Message: "Unknown error" }, { status: 500 });
  }
}
