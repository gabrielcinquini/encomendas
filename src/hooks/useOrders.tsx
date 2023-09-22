"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

export function useOrders() {
  const [orders, setOrders] = useState([]);

  async function getOrders() {
    try {
  
      // Forward the authorization header
      const response = await axios.get(
        "http://localhost:3000/api/registerOrder"
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
