import { NextRequest, NextResponse } from "next/server";
import { formatName } from "@/utils/utils";
import { prismaClient } from "@/database/client";

export async function GET() {
  const orders = await prismaClient.encomendas.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const { createdBy, userId, fac, item, quantity, contactPhone, name } =
    await req.json();

  if (!fac || !item || !quantity || !contactPhone || userId === -1 || !name) {
    return NextResponse.json(
      { message: "As credenciais devem ser inseridas" },
      { status: 400 }
    );
  }

  const newOrder = await prismaClient.encomendas.create({
    data: {
      createdBy: createdBy,
      name: name,
      fac: fac,
      contactPhone: contactPhone,
      item: item,
      quantity: Number(quantity),
      userId: userId,
    },
  });

  return NextResponse.json({ newOrder: newOrder });
}
