export type UserType = {
  id: string;
  password: string;
  confirmPassword: string;
  username: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  fac: string;
  nameRP: string;
  rpNumber: string;
}
export type OmitPasswordUserType = {
  id: string;
  username: string;
  provider: string;
  confirmed: Boolean;
  blocked: Boolean;
  fac: string;
  nameRP: string;
  rpNumber: string;
}

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