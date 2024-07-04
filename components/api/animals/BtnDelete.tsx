"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteFormProps {
    animalId: number;
}

export default function DeleteForm({ animalId }: DeleteFormProps) {
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/animals/delete?id=${animalId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                setMessage('Animal supprimé avec succès');
                router.push('/');
                router.refresh();
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'animal:', error);
            setMessage("Un problème est survenu lors de la suppression de l'animal");
        }
    };

    return (
        <>
            <button onClick={handleDelete} className='bg-red-200 hover:bg-red-300 border-2 border-red-300 p-2 text-red-700'>
                Supprimer
            </button>
            {message && <p className='text-red-600'>{message}</p>}
        </>
    );
}