"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteFormProps {
    animalId: number;
    animalName: string;
}

export default function DeleteForm({ animalId, animalName }: DeleteFormProps) {
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleDelete = async () => {
        const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer ${animalName} ?`);
        
        if (isConfirmed) {
            try {
                const res = await fetch(`/api/animals/delete?id=${animalId}`, {
                    method: 'DELETE',
                });

                const data = await res.json();

                if (data.success) {
                    setMessage('Animal supprimé avec succès.');
                    router.push('/');
                    router.refresh();
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'animal :', error);
                setMessage("Un problème est survenu lors de la suppression de l'animal.");
            }
        } else {
            setMessage("Suppression annulée.");
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