"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

export function useOrders() {
  const [orders, setOrders] = useState([]);

  async function getOrders() {
    try {
        const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APIURL}/api/registerOrder`
      );
           
      if(response.status === 200) {
        setOrders(response.data);
      }

    } catch (error) {
      console.error('Erro:', error);
    }
  }
  

  useEffect(() => {
    getOrders();
  }, []);

  return { orders, setOrders };
}
