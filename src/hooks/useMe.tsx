"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

export function useMe() {
  const [user, setUser] = useState<User>();
  const router = useRouter()

  async function getUser() {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) throw new Error('Token missing');
  
      // Forward the authorization header
      const response = await axios.get<User>(`${process.env.NEXT_PUBLIC_APIURL}/api/me`, {
        headers: { Authorization: token },
      });
      setUser(response.data);
  
    } catch (error) {
      console.error('Erro:', error); // Registre qualquer erro ocorrido
      localStorage.removeItem('token');
      router.push('/')
    }
  }
  

  useEffect(() => {
    getUser();
  }, []);

  return { user, setUser };
}
