import { NextRequest, NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { dbType, formatName } from "@/utils/utils";

export function GET() {
  const dbPath = path.join(process.cwd(), "src", "database", "db.json");
  let data: dbType = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  return NextResponse.json(data.orders)
}

export async function POST(req: NextRequest) {
  const {createdBy, userId, fac, item, quantity, contactPhone, name} = await req.json();

  if (!fac || !item || !quantity || !contactPhone || userId === -1 || !name) {
    return NextResponse.json(
      { message: "As credenciais devem ser inseridas" },
      { status: 400 }
    );
  }

  const dbPath = path.join(process.cwd(), "src", "database", "db.json");
  let dbData: dbType = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  let maxId = 1;
  for (const order of dbData.orders) {
    const orderId = order.id;
    if (orderId > maxId) {
      maxId = orderId;
    }
  }

  const newOrder = {
    id: maxId + 1,
    userId: userId,
    createdBy: createdBy,
    name: formatName(name),
    fac: formatName(fac),
    contactPhone: contactPhone,
    item: item,
    quantity: quantity
  }

  dbData.orders.push(newOrder);
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
  return NextResponse.json({ newOrder: newOrder });
}