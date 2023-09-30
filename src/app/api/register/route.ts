import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { prismaClient } from "@/database/client";
import { formatName } from "@/utils/utils";

export async function POST(req: NextRequest) {
  const { username, password, fac, rpNumber, nameRP, confirmPassword } = await req.json();

  if (!username || !password || !fac || !rpNumber || !nameRP || !confirmPassword) {
    return NextResponse.json(
      { message: "As credenciais devem ser inseridas" },
      { status: 400 }
    );
  }

  if(password !== confirmPassword) {
    return NextResponse.json({ message: "As senhas não conincidem" }, { status: 399})
  }

  const userNameExists = await prismaClient.user.findFirst({
    where: { username: username },
  });
  const nameRPExists = await prismaClient.user.findFirst({
    where: { nameRP: nameRP },
  });
  const rpNumberExists = await prismaClient.user.findFirst({
    where: { rpNumber: rpNumber },
  });

  if (userNameExists) {
    return NextResponse.json({ message: "Usuário já cadastrado" }, { status: 401 });
  }
  if (nameRPExists) {
    return NextResponse.json({ message: "Usuário com esse nome do RP já cadastrado" }, { status: 402 });
  }
  if (rpNumberExists) {
    return NextResponse.json({ message: "Número já cadastrado" }, { status: 403 });
  }

  const user = await prismaClient.user.create({
    data: {
      username: username,
      password: hashSync(password, 10),
      provider: "local",
      confirmed: true,
      blocked: false,
      fac: formatName(fac),
      rpNumber: rpNumber,
      nameRP: formatName(nameRP),
    },
  });

  const accessToken = sign({ sub: user.id }, "SUPER_SECRET", {
    expiresIn: "1d",
  });

  await prismaClient.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  return NextResponse.json({ accessToken, user });
}
