"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  role: string;
}

export default function ConnectedPage() {
  const [userData, setUserData] = useState<User | null>(null);
    const router = useRouter()
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if(!storedUser){
        router.push("/login");
        console.log("Accès refusé")
    }
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData(null);
    router.push('/login')
  };

  
  return (
    <div>
      {userData ? (
        <div className='flex flex-col px-6'>
            <h3 className='text-center text-3xl font-bold mb-6'>Information utilisateurs</h3>
            <div className='flex items-center gap-2 mb-1'>
                <p className='text-md'>Email:</p>
                <p className='text-lg'>{userData.email}</p>
            </div>
            <div className='flex items-center gap-2 mb-1'>
                <p className='text-md'>Role</p>
                <p className='text-lg'>{userData.role}</p>
            </div>
            <div className='flex items-center gap-2 mb-6'>
                <p>Futur lien vers Page dédié.</p>
            </div>
            <div className='flex w-full justify-center items-center'>
                <button className="rounded-full flex justify-center items-center border-4 border-red-400 hover:border-red-600 w-[60px] h-[60px] " onClick={handleLogout}>
                    <small className='text-bold text-red-400 hover:text-red-600'>Logout</small>
                </button> 
            </div>
          
        </div>
      ) : (
        <p className='w-full flex justify-center items-center text-center min-h-[500px]'>Chagement des données ...</p>
      )}
    </div>
  );
}