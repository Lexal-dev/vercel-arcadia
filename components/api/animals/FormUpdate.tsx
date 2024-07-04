"use client";

import BtnDelete from '@/components/api/animals/BtnDelete';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormUpdateProps {
    animalId: number;
    animalName: string;
    animalEtat: string;
}

export default function FormUpdate(props: FormUpdateProps) {
    const { animalId, animalName, animalEtat } = props;

    const [name, setName] = useState(animalName);
    const [etat, setEtat] = useState(animalEtat);
    const [message, setMessage] = useState('');

    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedName = name.trim() === '' ? animalName : name;
        const updatedEtat = etat.trim() === '' ? animalEtat : etat;

        try {
            const res = await fetch(`/api/animals/update?id=${animalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: updatedName, etat: updatedEtat }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(`L'animal : ${data.animal.name} a bien été modifié`);
                setName('');
                setEtat('');
                router.push('/');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Un problème est survenu lors de la modification de l'animal.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='flex flex-col w-[400px] items-center justify-around gap-4 bg-slate-300 rounded-md text-black p-6'>
                <div className='flex flex-col gap-6'>
                    <div className='flex justify-between w-full'>
                        <label>Nom:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <div className='flex justify-between w-full'>
                        <label>État:</label>
                        <input
                            type="text"
                            value={etat}
                            onChange={(e) => setEtat(e.target.value)}
                            required
                            minLength={3}
                            maxLength={100}
                        />
                    </div>            
                </div>
                <div className='flex items-center justify-around'>
                    <button type="submit" className='bg-yellow-200 hover:bg-yellow-300 border-2 border-yellow-300 p-2 text-yellow-700'>Modifier</button>
                    <BtnDelete animalId={animalId} animalName={animalName}/>             
                </div>
                {message && <p className='text-red-600'>{message}</p>}
            </form>
        </>
    );
}