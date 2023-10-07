"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { OrderSchemaData, orderSchema } from "@/validations/validations";

export function useOrders() {
  const [orders, setOrders] = useState<OrderSchemaData[]>([]);

  async function getOrders() {
    try {
      const response = await axios.get<OrderSchemaData>(
        `${process.env.NEXT_PUBLIC_APIURL}/api/registerOrder`
      );
      const validatedOrder = orderSchema.array().safeParse(response.data)
      if(!validatedOrder.success) {
        console.error('error: '+validatedOrder.error)
        return
      }
      setOrders(validatedOrder.data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  return { orders, setOrders };
}
