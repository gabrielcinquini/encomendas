"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Encomendas } from '@prisma/client';

export function useOrders() {
  const [orders, setOrders] = useState<Encomendas[]>([]);

  async function getOrders() {
    try {
        const response = await axios.get<Encomendas[]>(
        `${process.env.NEXT_PUBLIC_APIURL}/api/registerOrder`
      );        
      setOrders(response.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  

  useEffect(() => {
    getOrders();
  }, []);

  return { orders, setOrders };
}
