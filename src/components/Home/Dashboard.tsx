"use client";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { time } from "@/utils/utils";
import { useOrders } from "@/hooks/useOrders";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { Encomendas } from "@prisma/client";
import { UserShowType } from "@/validations/validations";

export default function Dashboard({user}: UserShowType) {
  const { orders, setOrders } = useOrders();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_APIURL}/api/registerOrder/${id}`);

      setOrders((prevState) => {
        return prevState.filter((order: Encomendas) => order.id !== id);
      });

      toast.success("Encomenda removida com sucesso!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredOrders =
    user?.provider === "admin"
      ? orders
      : orders.filter((order: Encomendas) => order.userId === user?.id);

  const totalPages = filteredOrders.length > 0 ? Math.ceil(filteredOrders.length / itemsPerPage) : 1;

  return (
    <div>
      {user?.provider === "admin" ? (
        <table className="w-full border-separate border-spacing-y-2 p-8">
          <thead className="text-left">
            <tr className="text-white">
              <th className="p-2">Criado por</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Total</th>
              <th>Criado em</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .slice(startIndex, endIndex)
              .map((order: Encomendas) => (
                <tr key={order.id} className="bg-green-700">
                  <td className="p-2">{order.createdBy}</td>
                  <td>
                    {order.name} - {order.fac}
                  </td>
                  <td>{order.contactPhone}</td>
                  <td>{order.item}</td>
                  <td>{order.quantity}</td>
                  <td>
                    {(order.quantity * 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td>{time(order.createdAt.toString())}</td>
                  <td align="right">
                    <button
                      className="bg-red-800 p-2 rounded-md"
                      onClick={() => {
                        handleDelete(order.id);
                      }}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <table className="w-full border-separate border-spacing-y-2 p-8">
          <thead>
            <tr className="text-white text-left">
              <th className="p-2">Item</th>
              <th className="p-2">Quantidade</th>
              <th className="p-2">Total</th>
              <th className="p-2"></th> {/* Coluna vazia para o botão */}
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .slice(startIndex, endIndex)
              .map((order: Encomendas) => (
                <tr key={order.id} className="bg-green-700">
                  <td className="p-2">{order.item}</td>
                  <td>{order.quantity}</td>
                  <td>
                    {(order.quantity * 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td align="right">
                    <button
                      className="bg-red-800 p-2 rounded-md"
                      onClick={() => {
                        handleDelete(order.id);
                      }}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <div className="flex gap-2 px-8">
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
        >
          Anterior
        </button>
        <span className="ml-4 mr-4 py-2">
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
          } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
        >
          Próxima
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
