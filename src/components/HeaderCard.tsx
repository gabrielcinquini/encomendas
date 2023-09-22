import { useMe } from "@/hooks/useMe";
import { useOrders } from "@/hooks/useOrders";
import { calcularTotal } from "@/utils/utils";
import React, { useState } from "react";

type HeaderCardType = {
  total: number;
};

export default function HeaderCard({ total }: HeaderCardType) {

  return (
    <div className='p-6 flex flex-col justify-between h-40 w-96 rounded-md bg-green-500'>
        <span className="text-gray-700 font-bold text-xl">Total</span>
      <footer>
        <span className="text-gray-800 font-bold text-4xl">
          {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </footer>
    </div>
  );
}
