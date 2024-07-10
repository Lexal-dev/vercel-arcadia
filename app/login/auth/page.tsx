"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/lib/decode';
import { FaSpinner } from 'react-icons/fa';

export default function AuthCheck() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        setLoading(false);
        router.push(`/login/auth/${decoded.userRole.toLowerCase()}`); // Redirect based on user role
      } else {
        console.error('Token invalide');
        localStorage.removeItem('token');
        router.push('/login');
      }
    } else {
      setLoading(false); // Stop loading if there is no token
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className='w-full flex justify-center items-center text-center min-h-[500px]'>
        
        Chargement des données...<FaSpinner className='animate-spin mr-2' /> 
      </div>
    );
  }

  return null;
}