"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { OmitPasswordUserType } from '@/utils/utils';

export function useMe() {
  const [user, setUser] = useState<OmitPasswordUserType>();
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  async function getUser() {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) throw new Error('Token missing');
  
      // Forward the authorization header
      const response = await axios.get('http://localhost:3000/api/me', {
        headers: { Authorization: token },
      });
      setUser(response.data);
      setIsLoading(false)
  
    } catch (error) {
      console.error('Erro:', error); // Registre qualquer erro ocorrido
      localStorage.removeItem('token');
      router.push('/')
      setIsLoading(false)
    }
  }
  

  useEffect(() => {
    getUser();
  }, []);

  return { user, setUser, isLoading, setIsLoading };
}
