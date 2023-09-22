import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";

import path from "path";
import fs from "fs";
import { UserType, dbType, formatName } from "@/utils/utils";

export async function POST(req: NextRequest) {
  const { username, password, fac, rpNumber, nameRP } = await req.json();

  if (!username || !password || !fac || !rpNumber || !nameRP) {
    return NextResponse.json(
      { message: "As credenciais devem ser inseridas" },
      { status: 400 }
    );
  }

  const dbPath = path.join(process.cwd(), "src", "database", "db.json");
  let data: dbType = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  const userRegistered = data.users.find(
    (u: UserType) =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.rpNumber === rpNumber ||
      u.nameRP.toLowerCase() === nameRP.toLowerCase()
  );

  if (userRegistered) {
    return NextResponse.json(
      { message: "Usuário já cadastrado" },
      { status: 401 }
    );
  }

  const newUser = {
    id: data.users.length + 1,
    username: username,
    password: hashSync(password, 10),
    provider: "local",
    confirmed: true,
    blocked: false,
    fac: fac,
    rpNumber: rpNumber,
    nameRP: formatName(nameRP),
  };
  data.users.push(newUser);

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  const accessToken = sign({ sub: newUser.id }, "SUPER_SECRET", {
    expiresIn: "1d",
  });

  Object.assign(newUser || {}, {
    password: undefined
  })

  return NextResponse.json({ accessToken, user: newUser });
}