"use client";

import "react-toastify/dist/ReactToastify.css";

import axios, { AxiosError } from "axios";
import Link from "next/link";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast, ToastContainer } from "react-toastify";

import { useRouter } from "next/navigation";
import { CreateLoginFormData, loginUserFormSchema, username } from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";

export default function Home() {

  const { register, handleSubmit, formState: {errors} } = useForm<CreateLoginFormData>({
    mode: 'all',
    resolver: zodResolver(loginUserFormSchema),
  });
  
  const router = useRouter();
  
  const handleLogin = async (data: CreateLoginFormData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APIURL}/api/login`,
        {
          username: data.username,
          password: data.password,
        }
      );

      if (response.status === 200) {
        router.push("/home");
        const token = response.data.accessToken;

        localStorage.setItem("token", token);
      }
    } catch (error) {
      // @ts-ignore
      if (error instanceof AxiosError && error.response.status === 404) {
        toast.error("Credenciais não encontradas", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Não foi possível conectar ao banco de dados", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        className="flex flex-col gap-2 items-center text-gray-800"
        onSubmit={handleSubmit(handleLogin)}
      >
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Usuário"
          {...register('username', {
            onChange: username
          })}
          autoComplete='off'
        />
        {errors.username && <ErrorMessage message={errors.username.message}/>}
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Senha"
          {...register('password')}
          autoComplete='off'
        />
        {errors.password && <ErrorMessage message={errors.password.message}/>}
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
