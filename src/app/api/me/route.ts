import { JsonWebTokenError, verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

import { dbType } from "@/utils/utils";

export function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "Invalid User" }, { status: 401 });
  }
  try {
    const { sub: userId } = verify(token, "SUPER_SECRET") as unknown as { sub: number };
    if (!userId) {
      return NextResponse.json({ message: "Invalid User" }, { status: 401 });
    }
    

    const dbPath = path.join(process.cwd(), "src", "database", "db.json");
    let data: dbType = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const user = data.users.find((u) => u.id === userId);
    Object.assign(user || {}, {
      password: undefined
    })

    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof JsonWebTokenError)
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    else
      return NextResponse.json({ Message: "Unknown error" }, { status: 500 });
  }
}