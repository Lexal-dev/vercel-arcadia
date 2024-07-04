"use client"
import React, { useState } from 'react';

export default function FormCreate() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/races/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(`La race : ${data.race.name} a bien été ajoutée`);
                setName('');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Un problème est survenu lors de la création de la race");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='flex flex-col w-[400px] items-center justify-around gap-4 bg-slate-300 rounded-md text-black p-6'>
                <div className='flex flex-col gap-6'>
                    <div className='flex justify-between w-full'>
                        <label>Nom de la race :</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                </div>
                <button type="submit" className='bg-green-200 hover:bg-green-300 border-2 border-green-300 p-2 text-green-700'>Ajouter une race</button>
                {message && <p className='text-green-600'>{message}</p>}        
            </form>
        </>
    );
}