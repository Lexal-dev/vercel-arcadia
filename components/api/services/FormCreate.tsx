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
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
                <button onClick={onClose} className="w-full flex justify-end text-red-500 hover:text-red-700"><MdClose size={36} /></button>
                <form onSubmit={handleSubmit} className="text-black">
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 border border-green-600 hover:border-green-700 text-white py-2 px-4 rounded">
                        Créer
                    </button>
                </form>
            </div>
        </div>
    );
}