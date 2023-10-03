"use client";

import "react-toastify/dist/ReactToastify.css";

import axios, { AxiosError } from "axios";
import Link from "next/link";

import { toast, ToastContainer } from "react-toastify";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}/api/login`, {
        username: username,
        password: password,
      });

      
      if (response.status === 200) {
        router.push("/home");
        const token = response.data.accessToken;

        localStorage.setItem("token", token);
      }
    } catch (error) {
      // @ts-ignore
      if(error instanceof AxiosError && error.response.status === 404) {
        toast.error('Credenciais não encontradas', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      toast.error('Não foi possível conectar ao banco de dados', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        className="flex flex-col gap-2 items-center text-gray-800"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Usuário"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex w-full justify-between">
          <input
            className="text-white px-6 py-2 rounded-xl bg-lime-600 w-fit hover:cursor-pointer"
            type="submit"
          />
          <Link
            href="/register"
            className="text-white bg-teal-950 px-6 py-2 rounded-xl"
          >
            Cadastrar
          </Link>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
