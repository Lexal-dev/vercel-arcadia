import React, { useState } from 'react';
import  Hours  from '@/models/hour'; // Assurez-vous que ceci est le bon chemin vers votre type Hour

interface FormUpdateProps {
    hour: Hours;
    onClose: () => void;
    onUpdate: (updatedHour: Hours) => void;
}

const FormUpdate: React.FC<FormUpdateProps> = ({ hour, onClose, onUpdate }) => {
    const [days, setDays] = useState(hour.days);
    const [open, setOpen] = useState(hour.open);
    const [close, setClose] = useState(hour.close);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedHour = { ...hour, days, open, close };

        try {
            const response = await fetch('/api/hours/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedHour),
            });

            const data = await response.json();
            if (data.success) {
                onUpdate(data.hour);
                onClose();
            } else {
                console.error('Failed to update hour:', data.message);
            }
        } catch (error) {
            console.error('Error updating hour:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg">
                <form onSubmit={handleSubmit} className='text-black'>
                    <div className="mb-4">
                        <label className="block text-gray-700">Jours</label>
                        <input
                            type="text"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Ouverture</label>
                        <input
                            type="text"
                            value={open}
                            onChange={(e) => setOpen(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Fermeture</label>
                        <input
                            type="text"
                            value={close}
                            onChange={(e) => setClose(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            Mettre à jour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormUpdate;