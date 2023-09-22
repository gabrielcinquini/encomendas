import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/database/client";

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  const orderDeleted = await prismaClient.encomendas.delete({ where: { id: id } });

  if(!orderDeleted) {
    return NextResponse.json({message: "Não foi possível deletar essa encomenda"}, {status: 400})
  }

  return NextResponse.json(
    { message: "Encomenda deletada com sucesso!" },
    { status: 200 }
  );
}
