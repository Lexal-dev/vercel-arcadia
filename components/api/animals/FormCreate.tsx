"use client"
import React, { useState } from 'react';
export default function FormCreate() {

    const [name, setName] = useState('');
    const [etat, setEtat] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const res = await fetch('/api/animals/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, etat }),
        });
  
        const data = await res.json();
  
        if (data.success) {
          setMessage(`L'animal : ${data.animal.name} a bien été ajouté`);
          setName('');
          setEtat('');
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Un problème est survenu lors de la création de l'animal");
      }
    };


  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col w-[400px] items-center justify-around gap-4 bg-slate-300 rounded-md text-black p-6'>
        <div className='flex flex-col gap-6'>
            <div className='flex justify-between w-full'>
            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            </div>
            <div className='flex justify-between w-full'>
            <label>Etat:</label>
            <input
                type="text"
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
                required
            />
            </div>            
        </div>

        <button type="submit" className='bg-green-200 hover:bg-green-300 border-2 border-green-300 p-2 text-green-700'>Add Animal</button>
        {message && <p className='text-green-600'>{message}</p>}        
      </form>
      
    </>
  )
}
