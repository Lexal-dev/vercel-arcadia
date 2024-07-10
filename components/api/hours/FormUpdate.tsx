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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center bg-foreground py-12 w-full md:w-1/2 rounded-lg">
                <form onSubmit={handleSubmit} className='flex flex-col w-2/3 text-secondary'>
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Jours</label>
                        <input
                            type="text"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Ouverture</label>
                        <input
                            type="text"
                            value={open}
                            onChange={(e) => setOpen(e.target.value)}
                            className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
                        />
                    </div>
                    <div className="mb-12">
                        <label className="block font-bold mb-2">Fermeture</label>
                        <input
                            type="text"
                            value={close}
                            onChange={(e) => setClose(e.target.value)}
                            className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
                        />
                    </div>

                    <div className="flex w-full justify-center  text-white">
                        <button type="submit" className="w-1/2 bg-muted hover:bg-background py-2">
                            Mettre à jour
                        </button>
                        <button type="button" onClick={onClose} className="w-1/2 bg-red-500 hover:bg-red-700 py-2">
                            Annuler
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormUpdate;