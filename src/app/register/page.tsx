"use client";

import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { UserType } from "@/utils/utils";

export default function Home() {
  const [user, setUser] = useState<Omit <UserType, "id" | "provider" | "confirmed" | "blocked">>({
    username: "",
    nameRP: "",
    rpNumber: "",
    fac: "",
    password: "",
    confirmPassword: ""
  });

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}/api/register`, user);
      
      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      router.push("/home");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          toast.error("As credenciais devem ser inseridas", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (err.response?.status === 401) {
          toast.error("Usuário já cadastrado", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (err.response?.status === 402) {
          toast.error("Usuário com esse nome do RP já cadastrado", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (err.response?.status === 403) {
          toast.error("Número já cadastrado", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (err.response?.status === 399) {
          toast.error("As senhas não coincidem", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        toast.error("Erro de rede ou outra falha", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        className="flex flex-col gap-2 items-center text-gray-800"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <input
          className="p-2 rounded-xl"
          type="text"
          name="username"
          placeholder="Usuário"
          onChange={handleChange}
        />
        <input
          className="p-2 rounded-xl"
          type="text"
          name="nameRP"
          placeholder="Nome e Sobrenome RP"
          onChange={handleChange}
        />
        <input
          className="p-2 rounded-xl"
          type="text"
          name="rpNumber"
          placeholder="Número celular RP"
          onChange={handleChange}
        />
        <input
          className="p-2 rounded-xl"
          type="text"
          name="fac"
          placeholder="Facção"
          onChange={handleChange}
        />
        <input
          className="p-2 rounded-xl"
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
        />
        <input
          className="p-2 rounded-xl"
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Senha"
          onChange={handleChange}
        />
        <input
          className="text-white px-6 py-2 rounded-xl bg-lime-600 w-fit hover:cursor-pointer"
          type="submit"
        />
      </form>

      <ToastContainer />
    </div>
  );
}
