"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/lib/decode';
import Link from 'next/link';

interface User {
  userEmail: string;
  userRole: string;
}

const ConnectedPage: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        setCurrentUser({
          userEmail: decoded.userEmail,
          userRole: decoded.userRole,
        });
      } else {
        console.error('Token invalide');
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  }, [router]);

  if (!currentUser) {
    return <p className='w-full flex justify-center items-center text-center min-h-[500px]'>Chargement des données...</p>;
  }

    const userRole = currentUser.userRole
    userRole.toLowerCase()
    const userSpace = `/login/auth/${userRole.toLowerCase()}`;

  return (
    <main className='flex flex-col items-center py-12'>
      <button className="rounded-full flex justify-center items-center border-4 border-red-400 hover:border-red-600 w-[60px] h-[60px] mb-6" onClick={handleLogout}>
          <small className='text-bold text-red-400 hover:text-red-600'>Logout</small>
      </button>
      <div className='w-1/4'>
        <div className='flex items-center  gap-2 mb-1'>
          <p className='text-md'>Email:</p>
          <p className='text-md'>{currentUser.userEmail}</p>
        </div>
        <div className='flex items-center  gap-2 mb-1'>
          <p className='text-md'>Role:</p>
          <p className='text-md'>{currentUser.userRole}</p>
        </div>
        <Link href={userSpace}>Espace dédié</Link>        
      </div>
    </main>
  );
};

export default ConnectedPage;