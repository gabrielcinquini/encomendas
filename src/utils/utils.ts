import { OrderSchemaData } from "@/validations/validations";
import { Encomendas } from "@prisma/client";

export function formatName(name: string) {
  if (!name) return "";

  const words = name.toLowerCase().split(" ");

  const formattedName = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return formattedName.join(" ");
}

export function calcularTotal(orders: OrderSchemaData[]) {
  const totalQuantidades = orders.reduce((total, order) => {
    const quantidade = parseInt(order.quantity.toString(), 10);

    if (!isNaN(quantidade)) {
      return total + quantidade;
    }

    return total;
  }, 0);

  const totalMultiplicado = totalQuantidades * 100;

  return totalMultiplicado;
}

export function time(timestamp: string): string {
  const data = new Date(timestamp);
  data.setTime(data.getTime() - data.getTimezoneOffset() * 60000);

  const dia = data.getUTCDate().toString().padStart(2, "0");
  const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
  const hora = data.getUTCHours().toString().padStart(2, "0");
  const minuto = data.getUTCMinutes().toString().padStart(2, "0");

  return `${dia}/${mes} às ${hora}:${minuto}`;
}

export function formatUsername(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = currentValue.replace(/[\W_]+/g, "").toLocaleLowerCase();
  event.target.value = newVal;

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos;
    event.target.selectionEnd = currentPos;
  }
}

export function formatFac(event: React.ChangeEvent<HTMLInputElement>) {
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

export function formatNameRP(event: React.ChangeEvent<HTMLInputElement>) {
  let currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = formatName(currentValue);
  event.target.value = newVal;

  if (currentValue !== newVal) {
    event.target.selectionStart = currentPos;
    event.target.selectionEnd = currentPos;
  }
}

export function formatRPNumber(event: React.ChangeEvent<HTMLInputElement>) {
  const currentValue = event.target.value;
  const currentPos = event.target.selectionStart || 0;

  const newVal = formatPhone(currentValue);
  event.target.value = newVal;
}

const formatPhone = (value?: string) => {
  if (value === undefined) return "";
  let valueFormatted = value;

  if (valueFormatted.length <= 4) {
    valueFormatted = valueFormatted.replace(/[^\w-]+/g, "");
  } else {
    valueFormatted = valueFormatted.replace(/[^\dX]/gi, "").toUpperCase();
  }

  valueFormatted = valueFormatted.substring(0, 6);
  return valueFormatted.replace(/^(\d{3})([\d{3}])/, "$1-$2");
};