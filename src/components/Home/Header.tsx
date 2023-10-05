"use client"

import "react-toastify/dist/ReactToastify.css";

import React, { useState } from "react";
import HeaderCard from "../HeaderCard";
import Modal from "react-modal";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import { registerOrderFormSchema, RegisterOrderFormSchema, UserShowType } from "@/validations/validations";
import { calcularTotal, formatFac, formatNameRP, formatRPNumber } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../ErrorMessage";
import { Encomendas } from "@prisma/client";

export default function Header({user}: UserShowType) {
  const router = useRouter();
  const { orders } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const {register, handleSubmit, formState: { errors }} = useForm<RegisterOrderFormSchema>({
    mode: "all",
    resolver: zodResolver(registerOrderFormSchema),
    defaultValues: {
      userId: user.id,
      createdBy: user.nameRP,
      name: user.provider !== "admin" ? user.nameRP : '',
      fac: user.provider !== "admin" ? user.fac : '',
      contactPhone: user.provider !== "admin" ? user.rpNumber : ''
    }
  });


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  
  const handleRegisterOrder = async (order: RegisterOrderFormSchema) => {
    try {
      console.log(order)
      await axios.post(`${process.env.NEXT_PUBLIC_APIURL}/api/registerOrder`, {
        userId: order.userId,
        createdBy: order.createdBy,
        name: order.name,
        contactPhone: order.contactPhone,
        fac: order.fac,
        item: order.item,
        quantity: order.quantity,
      });
      toast.success("Encomenda cadastrada com sucesso!", {
        position: toast.POSITION.TOP_LEFT,
      });
      closeModal();
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
    user.provider === "admin"
      ? orders
      : orders.filter((order: Encomendas) => order.userId === user.id);

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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "40%",
            height: "75%",
            margin: "auto",
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
              onSubmit={handleSubmit(handleRegisterOrder)}
            >
              {user?.provider === "admin" && (
                <>
                  <input
                    autoComplete="off"
                    type="text"
                    className="bg-slate-200 rounded-md p-4 appearance-none"
                    placeholder="Nome"
                    {...register('name', {
                      onChange: formatNameRP
                    })}
                  />
                  {errors.name && <ErrorMessage message={errors.name.message}/>}
                  <input
                    autoComplete="off"
                    type="text"
                    className="bg-slate-200 rounded-md p-4 appearance-none"
                    placeholder="Facção"
                    {...register('fac', {
                      onChange: formatFac
                    })}
                  />
                  {errors.fac && <ErrorMessage message={errors.fac.message}/>}
                  <input
                    autoComplete="off"
                    type="text"
                    className="bg-slate-200 rounded-md p-4 appearance-none"
                    placeholder="Número"
                    {...register('contactPhone', {
                      onChange: formatRPNumber
                    })}
                  />
                  {errors.contactPhone && <ErrorMessage message={errors.contactPhone.message}/>}
                </>
              )}
              <select
                className="bg-slate-200 rounded-md p-4 appearance-none"
                defaultValue={"ZN"}
                {...register('item')}
                >
                <option value="K2">K2</option>
              </select>
              {errors.item && <ErrorMessage message={errors.item.message}/>}
              <input
              type="number"
              className="bg-slate-200 rounded-md p-4 appearance-none"
              placeholder="Quantidade"
              {...register("quantity")}
              />
              {errors.quantity && <ErrorMessage message={errors.quantity.message}/>}
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
