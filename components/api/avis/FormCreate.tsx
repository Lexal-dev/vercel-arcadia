"use client"
import React, { useState } from 'react';
import NekoToast from '@/components/ui/_partial/Toast'; // Assurez-vous que le chemin est correct

export default function FormCreate() {
    const [pseudo, setPseudo] = useState('');
    const [comment, setComment] = useState('');
    const [toast, setToast] = useState<{ type: 'Success' | 'Error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/avis/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pseudo, comment }),
            });

            const data = await res.json();

            if (res.ok) {
                setToast({ type: 'Success', message: 'Avis créé avec succès.' });
                setPseudo('');
                setComment('');
            } else {
                setToast({ type: 'Error', message: data.message || 'Une erreur est survenue lors de la création de l\'avis.' });
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'avis:', error);
            setToast({ type: 'Error', message: 'Un problème est survenu lors de la création de l\'avis.' });
        }

        setTimeout(() => setToast(null), 3000);
    };

    return (
        <>
            {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} />}
            <h1 className='font-bold text-4xl text-center'>Votre avis</h1>
            <form onSubmit={handleSubmit} className='flex flex-col min-w-[300px] border-2 border-slate-300 rounded-md p-6 gap-6 bg-muted'>
                <div className='flex flex-col gap-6'>
                    <div className='flex gap-3 justify-between items-center'>
                        <label>Pseudo:</label>
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            required
                            minLength={3}
                            maxLength={30}
                            className='w-2/3 p-2 rounded-md bg-background hover:bg-muted-foreground'
                        />
                    </div>
                    <div className='flex gap-3 justify-between items-center'>
                        <label>Commentaire:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            minLength={3}
                            maxLength={150}
                            className='w-2/3 p-2 rounded-md bg-background hover:bg-muted-foreground'
                        />
                    </div>
                </div>

                <button type="submit" className='bg-green-200 hover:bg-green-300 border-2 border-green-300 p-2 text-green-700'>Ajouter un avis</button>
            </form>
        </>
    );
}