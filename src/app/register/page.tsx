"use client";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { CreateRegisterFormData, fac, nameRP, registerUserFormSchema, username } from "@/utils/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/ErrorMessage";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRegisterFormData>({
    mode: "all",
    resolver: zodResolver(registerUserFormSchema),
  });

  const router = useRouter();

  const handleRegister = async (user: CreateRegisterFormData) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_APIURL}/api/register`, user);

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
        toast.error("Não foi possível conectar com o banco de dados", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        className="flex flex-col gap-2 items-center text-gray-800"
        onSubmit={handleSubmit(handleRegister)}
      >
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Usuário"
          {...register("username", {
            onChange: username
          })}
          autoComplete='off'
          />
          {errors.username && <ErrorMessage message={errors.username.message}/>}
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Nome e Sobrenome RP"
          {...register("nameRP", {
            onChange: nameRP
          })}
          autoComplete='off'
          />
          {errors.nameRP && <ErrorMessage message={errors.nameRP.message}/>}
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Número celular RP"
          {...register("rpNumber")}
          autoComplete='off'
          />
          {errors.rpNumber && <ErrorMessage message={errors.rpNumber.message}/>}
        <input
          className="p-2 rounded-xl"
          type="text"
          placeholder="Facção"
          {...register("fac", {
            onChange: fac
          })}
          autoComplete='off'
          />
          {errors.fac && <ErrorMessage message={errors.fac.message}/>}
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Senha"
          {...register("password")}
          />
          {errors.password && <ErrorMessage message={errors.password.message}/>}
        <input
          className="p-2 rounded-xl"
          type="password"
          placeholder="Confirmar Senha"
          {...register("confirmPassword")}
          autoComplete='off'
          />
          {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message}/>}
        <input
          className="text-white px-6 py-2 rounded-xl bg-lime-600 w-fit hover:cursor-pointer"
          type="submit"
        />
      </form>

      <ToastContainer />
    </div>
  );
}
