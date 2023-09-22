import { NextRequest, NextResponse } from "next/server";

import { sign } from "jsonwebtoken";
import { compareSync } from "bcryptjs";

import path from "path";
import fs from "fs";
import { UserType, dbType } from "@/utils/utils";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "username or password must be provided" },
      { status: 404 }
    );
  }

  const dbPath = path.join(process.cwd(), "src", "database", "db.json");
  let data: dbType = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  const user = data.users.find(
    (u: UserType) =>
      u.username === username && compareSync(password, u.password)
  );
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const accessToken = sign({ sub: user.id }, "SUPER_SECRET", {
    expiresIn: "1d",
  });

  return NextResponse.json({
    accessToken,
    user: { ...user, password: undefined },
  });

}