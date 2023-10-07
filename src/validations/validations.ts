import { User } from "@prisma/client";
import { z } from "zod";

export const registerUserFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Insira o usuário(3 ou mais letras)")
      .regex(/^([a-z]|[0-9])+$/, "Formato inválido"),
    nameRP: z
      .string()
      .regex(/^[A-Z][a-z]+ [A-Z][a-z]+$/, "Nome inválido(Joe Mango)"),
    rpNumber: z
      .string()
      .regex(/^[0-9]{3}-[0-9]{3}$/, "Número de celular inválido(123-456)"),
    fac: z
      .string()
      .min(3, "Insira a facção(3 ou mais letras)")
      .regex(/^[A-Z]{1}[a-z]{2,}$/, "Formato inválido"),
    password: z.string().min(5, "Insira a senha(5 ou mais caracteres)"),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .transform((data) => {
    if (data.username) {
      data.username = data.username.toLowerCase();
    }
    return data;
  });
export type CreateRegisterFormData = z.infer<typeof registerUserFormSchema>;

export const loginUserFormSchema = z.object({
  username: z.string().min(1, "Insira o usuário"),
  password: z.string().min(1, "Insira a senha"),
});
export type CreateLoginFormData = z.infer<typeof loginUserFormSchema>;

export const orderSchema = z.object({
  id: z
    .string()
    .regex(
      /^([a-z]|[0-9]){8}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){12}$/g,
      "Formato de ID inválido"
    ),
  createdBy: z
    .string()
    .regex(/^[A-Z][a-z]+ [A-Z][a-z]+$/, "Formato inválido(Joe Mango)"),
  name: z
    .string()
    .regex(/^[A-Z][a-z]+ [A-Z][a-z]+$/, "Formato inválido(Joe Mango)"),
  fac: z.string().regex(/^[A-Z]{1}[a-z]{2,}$/, "Formato inválido(Smokes)"),
  contactPhone: z
    .string()
    .regex(/^[0-9]{3}-[0-9]{3}$/, "Número de celular inválido(123-456)"),
  item: z.string().min(2, "O item deve ter ao menos 2 caracteres"),
  quantity: z.number().positive(),
  createdAt: z.string(),
  userId: z
    .string()
    .regex(
      /^([a-z]|[0-9]){8}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){12}$/g,
      "Formato de ID do usuário inválido"
    ),
});
export type OrderSchemaData = z.infer<typeof orderSchema>;

export const registerOrderFormSchema = orderSchema
  .omit({
    id: true,
    createdAt: true,
  })
  .strict();
export type RegisterOrderFormSchema = z.infer<typeof registerOrderFormSchema>;

export type UserShowType = {
  user: Omit<User, "password" | "lastLogin">;
};
