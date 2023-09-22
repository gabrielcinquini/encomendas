import dbJson from '../database/db.json'

export type dbType = {
  users: UserType[];
  orders: OrdersType[];
}

export type UserType = {
  id: number;
  password: string;
  username: string;
  provider: string;
  confirmed: Boolean;
  blocked: Boolean;
  fac: string;
  nameRP: string;
  rpNumber: string;
}
export type OmitPasswordUserType = {
  id: number;
  username: string;
  provider: string;
  confirmed: Boolean;
  blocked: Boolean;
  fac: string;
  nameRP: string;
  rpNumber: string;
}

export type OrdersType = {
  id: number;
  userId: number;
  name: string;
  createdBy: string;
  contactPhone: string;
  fac: string;
  item: string;
  quantity: number;
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

  const totalMultiplicado = totalQuantidades * 20;

  return totalMultiplicado;
}