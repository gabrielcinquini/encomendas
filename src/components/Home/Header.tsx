import "react-toastify/dist/ReactToastify.css";

import { useMe } from "@/hooks/useMe";
import React, { useState } from "react";
import HeaderCard from "../HeaderCard";
import Modal from "react-modal";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import { calcularTotal, OrdersType } from "@/utils/utils";

export default function Header() {
  const router = useRouter();

  const { user, setUser } = useMe();
  const { orders, setOrders } = useOrders();
  const [registerOrder, setRegisterOrder] = useState({
    userId: -1,
    name: "",
    contactPhone: "",
    fac: "",
    item: "ZN",
    quantity: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user?.provider === "admin") {
      setRegisterOrder({
        ...registerOrder,
        [e.target.name]: e.target.value,
      });
    } else {
      setRegisterOrder({
        ...registerOrder,
        name: user?.nameRP || "",
        fac: user?.fac || "",
        contactPhone: user?.rpNumber || "",
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegisterOrder({
      ...registerOrder,
      item: e.target.value, // Atualiza o valor 'fac' com o valor selecionado do <select>
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/registerOrder",
        {
          userId: user?.id,
          createdBy: user?.nameRP,
          name: registerOrder.name,
          contactPhone: registerOrder.contactPhone,
          fac: registerOrder.fac,
          item: registerOrder.item,
          quantity: registerOrder.quantity,
        }
      );
      toast.success("Encomenda cadastrada com sucesso!", {
        position: toast.POSITION.TOP_LEFT,
      });
      closeModal()
    } catch (err) {
      //@ts-ignore
      if (err instanceof AxiosError && err.response.status === 400) {
        toast.error("As credenciais devem ser inseridas", {
          position: toast.POSITION.TOP_LEFT,
        });
      } else {
        toast.error("Não foi possível cadastrar essa encomenda", {
          position: toast.POSITION.TOP_LEFT,
        });
      }
    }
  };

  const filteredOrders =
    user?.provider === "admin"
      ? orders
      : orders.filter((order: OrdersType) => order.userId === user?.id);

  const total = calcularTotal(filteredOrders);

  return (
    <header className="bg-purple-900 h-1/4 py-12 px-32 flex flex-col">
      <div className="flex justify-between">
        <span>
          Olá {user?.nameRP}
          <button
            className="ml-4 bg-slate-900 p-2 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </span>
        <div className="flex justify-center">
          <HeaderCard total={total} />
        </div>
        <button
          className="bg-purple-800 px-4 py-2 rounded-md border-none h-min"
          onClick={openModal}
        >
          Nova transação
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Register Modal"
        style={{
          overlay: {
            // Estilo do overlay (fundo por trás do modal)
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            // Estilo do conteúdo do modal
            width: "40%",
            height: "75%", // Defina a largura desejada aqui
            margin: "auto", // Isso centralizará o modal horizontalmente
          },
        }}
      >
        <button
          className="absolute right-10 px-2 text-white bg-slate-700 rounded-lg"
          onClick={closeModal}
        >
          X
        </button>
        <div className="text-slate-800">
          <div className="p-16">
            <h1 className="text-gray-800 bolder text-4xl mb-12">
              Cadastrar venda
            </h1>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {user?.provider === "admin" && (
                <>
                  <input
                    autoComplete="off"
                    name="name"
                    type="text"
                    className="bg-slate-200 rounded-md p-4 appearance-none"
                    placeholder="Nome"
                    onChange={handleChange}
                  />
                  <input
                    autoComplete="off"
                    name="fac"
                    type="text"
                    className="bg-slate-200 rounded-md p-4 appearance-none"
                    placeholder="Facção"
                    onChange={handleChange}
                  />
                  <input
                    autoComplete="off"
                    name="contactPhone"
                    type="text"
                    className="bg-slate-200 rounded-md p-4 appearance-none"
                    placeholder="Número"
                    onChange={handleChange}
                  />
                </>
              )}
              <select
                className="bg-slate-200 rounded-md p-4 appearance-none"
                defaultValue={registerOrder.item}
                onChange={handleSelectChange}
              >
                <option value="ZN">ZN</option>
              </select>
              <input
                name="quantity"
                type="number"
                className="bg-slate-200 rounded-md p-4 appearance-none"
                placeholder="Quantidade"
                onChange={handleChange}
              />
              <input
                type="submit"
                className="text-white bg-green-400 py-6 rounded-md hover:cursor-pointer text-lg"
              />
            </form>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </header>
  );
}
