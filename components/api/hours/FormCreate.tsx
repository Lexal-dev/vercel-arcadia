"use client"
import React, { useState } from 'react';
import Hour from '@/models/hour';

interface FormCreateProps {
    onClose: () => void;
    onCreate: (newHour: Hour) => void;
}

const FormCreate: React.FC<FormCreateProps> = ({ onClose, onCreate }) => {
    const [days, setDays] = useState('');
    const [open, setOpen] = useState('');
    const [close, setClose] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/hours/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ days, open, close }),
        });

        const data = await response.json();
        if (data.success) {
            onCreate(data.hour);
            onClose();
        } else {
            console.error('Failed to create hour:', data.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-md text-black">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="days">
                            Jours
                        </label>
                        <input
                            type="text"
                            id="days"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="open">
                            Ouverture
                        </label>
                        <input
                            type="text"
                            id="open"
                            value={open}
                            onChange={(e) => setOpen(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="close">
                            Fermeture
                        </label>
                        <input
                            type="text"
                            id="close"
                            value={close}
                            onChange={(e) => setClose(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                            Annuler
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormCreate;