import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { OrdersType } from "@/utils/utils";

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  const dbPath = path.join(process.cwd(), "src", "database", "db.json");
  let { orders, ...rest } = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const index = orders.findIndex((o: OrdersType) => o.id === parseInt(id, 10));

  if (index === -1) {
    return NextResponse.json({message: 'Encomenda não encontrada'}, {status: 404})
  }

  orders = orders.filter((o: OrdersType) => o.id !== parseInt(id, 10));

  fs.writeFileSync(dbPath, JSON.stringify({ ...rest, orders }, null, 2));

  return NextResponse.json({message: 'Encomenda deletada com sucesso!'}, {status: 200})
}
