"use client"
import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

interface FormCreateProps {
    onCreateSuccess: () => Promise<void>;
    onClose: () => void;
    // D'autres propriétés peuvent être définies ici selon les besoins
}

export default function FormCreate({ onCreateSuccess, onClose }: FormCreateProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/services/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        });

        const data = await response.json();
        if (data.success) {
            onCreateSuccess();
        } else {
            setError(data.message || 'Failed to create service');
            console.error('Error creating service:', data.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="w-full md:w-2/3 bg-foreground p-4">
                <button onClick={onClose} className="w-full flex justify-end text-red-500 hover:text-red-700"><MdClose size={36} /></button>
                <form onSubmit={handleSubmit} className="text-seconday">
        
                    <div className="mb-4">
                        <label className="block text-gray-700">Nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-muted hover:bg-background text-white p-2 rounded mt-6">
                        Créer
                    </button>
                </form>
            </div>
        </div>
    );
}