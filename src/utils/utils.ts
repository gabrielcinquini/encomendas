import { z } from "zod";

export const registerUserFormSchema = z
  .object({
    username: z.string()
      .min(3, 'Insira o usuário(3 ou mais letras)')
      .regex(/^([a-z]|[0-9])+$/, 'Formato inválido'),
    nameRP: z.string()
      .regex(/^[A-Z][a-z]+ [A-Z][a-z]+$/, "Nome inválido(Joe Mango)"),
    rpNumber: z.string()
      .regex(/^[0-9]{3}-[0-9]{3}$/, "Número de celular inválido(123-456)"),
    fac: z.string()
      .min(3, "Insira a facção(3 ou mais letras)")
      .regex(/^[A-Z]{1}[a-z]{2,}$/, "Formato inválido"),
    password: z.string()
      .min(5, "Insira a senha(5 ou mais caracteres)"),
    confirmPassword: z.string()
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
  username: z.string().min(1, 'Insira o usuário'),
  password: z.string().min(1, 'Insira a senha')
})
export type CreateLoginFormData = z.infer<typeof loginUserFormSchema>



export type OrdersType = {
  id: string;
  userId: string;
  name: string;
  createdBy: string;
  contactPhone: string;
  fac: string;
  item: string;
  quantity: number;
  createdAt: string;
}

export function formatName(name: string) {
  if (!name) return '';

  const words = name.toLowerCase().split(' ');

  const formattedName = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return formattedName.join(' ');
}

export function calcularTotal(orders: OrdersType[]) {
  const totalQuantidades = orders.reduce((total, order) => {
    // Converte a quantidade de string para número usando parseInt
    const quantidade = parseInt(order.quantity.toString(), 10);

    // Verifica se a conversão é válida (não é NaN)
    if (!isNaN(quantidade)) {
      return total + quantidade;
    }

    return total;
  }, 0);

  const totalMultiplicado = totalQuantidades * 100;

  return totalMultiplicado;
}

export function time(timestamp: string): string {
  const date = new Date(timestamp);
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
  const dia = date.getUTCDate();
  const mes = date.getUTCMonth() + 1;
  const hora = date.getUTCHours();
  const minuto = date.getUTCMinutes();

  const diaFormatado = dia.toString().padStart(2, '0');
  const mesFormatado = mes.toString().padStart(2, '0');

  return `${diaFormatado}/${mesFormatado} às ${hora}:${minuto}`;
}

export function username(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = currentValue
    .replace(/[\W_]+/g, "")
    .toLocaleLowerCase();
  event.target.value = newVal;

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos;
    event.target.selectionEnd = currentPos;
  }
}


export function fac(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = currentValue
    .replace(/[\W_0-9]+/g, "")
    .toLowerCase()
    .replace(/^(.)/, (_, p1) => p1.toUpperCase());
  event.target.value = newVal;

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos;
    event.target.selectionEnd = currentPos;
  }
}

export function nameRP(event: React.ChangeEvent<HTMLInputElement>) {
  let currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = formatName(currentValue)
  event.target.value = newVal;

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos;
    event.target.selectionEnd = currentPos;
  }
}