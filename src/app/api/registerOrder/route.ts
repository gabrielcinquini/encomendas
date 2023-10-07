import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/database/client";
import { registerOrderFormSchema } from "@/validations/validations";

//TODO: ZOD ERRORS
export async function GET() {
  const orders = await prismaClient.encomendas.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsedBody = registerOrderFormSchema.safeParse(body);
  if(!parsedBody.success) {
    return NextResponse.json(parsedBody.error)
  }

  const { createdBy, userId, fac, item, quantity, contactPhone, name } = parsedBody.data;

  if (!fac || !item || !quantity || !contactPhone || !name) {
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

  return NextResponse.json({ newOrder });
}
