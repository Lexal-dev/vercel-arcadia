"use client"
import React, { useEffect, useState } from 'react';
import Hour from '@/models/hour';
import FormUpdate from '@/components/api/hours/FormUpdate'; // Correct import
import FormCreate from '@/components/api/hours/FormCreate'; // Correct import
import { MdDelete, MdEdit } from 'react-icons/md';
import NekoToast from '@/components/ui/_partial/Toast';

export default function HoursManager() {
    const [hours, setHours] = useState<Hour[]>([]);
    const [selectedHour, setSelectedHour] = useState<Hour | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);

    const fetchHours = async (additionalParam: string | number) => {
        try {
            const response = await fetch(`/api/hours/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`, {
                method: 'GET',
            });

            const data = await response.json();
            if (data.success) {
                setHours(data.hours);
            } else {
                console.error('Failed to fetch hours:', data.message);
            }
        } catch (error) {
            console.error('Error fetching hours:', error);
        }
    };

    useEffect(() => {
        fetchHours('hours');
    }, []);

    const handleUpdateClick = (hour: Hour) => {
        setSelectedHour(hour);
    };

    const handleUpdate = (updatedHour: Hour) => {
        setHours(hours.map(hour => hour.id === updatedHour.id ? updatedHour : hour));
        showToast('Update', 'Horraire modifier avec succès' );
    };

    const handleCreateClick = () => {
        setIsCreateOpen(true);
    };

    const handleCreate = (newHour: Hour) => {
        setHours([...hours, newHour]);
        showToast('Success', 'Horraire crée avec succès' );
    };

    const handleClose = () => {
        setSelectedHour(null);
        setIsCreateOpen(false);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch('/api/hours/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.success) {
                setHours(hours.filter(hour => hour.id !== id));
            } else {
                console.error('Failed to delete hour:', data.message);
            }
            showToast('Delete', 'Horraire effacée avec succès' );
        } catch (error) {
            console.error('Error deleting hour:', error);
        }
    };
    const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
        setToast({ type, message });
        setTimeout(() => {
          setToast(null);
        }, 3000); // Masquer le toast après 3 secondes
      };
    return (
        <main className="flex flex-col py-12 items-center">
            {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)} />}
            <button
                onClick={handleCreateClick}
                className="bg-foreground hover:bg-muted-foreground hover:text-white text-secondary py-1 px-3 rounded-md mb-6"
            >
                Ajouter un horaire
            </button>
            <div className="overflow-x-auto w-full flex flex-col items-center">
                <table className="w-full md:w-2/3 shadow-md">
                    <thead className="bg-muted-foreground">
                        <tr>
                            <th className="py-3 px-2 text-left">Jours</th>
                            <th className="py-3 px-2 text-left">Ouverture</th>
                            <th className="py-3 px-2 text-left">Fermeture</th>
                            <th className="py-3 px-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map(hour => (
                            <tr key={hour.id} className="bg-foreground text-secondary hover:bg-muted">
                                <td className="py-3 px-2 border-b-2 border-background">{hour.days}</td>
                                <td className="py-3 px-2 border-b-2 border-background">{hour.open}</td>
                                <td className="py-3 px-2 border-b-2 border-background">{hour.close}</td>
                                <td className="py-3 px-2 border-b-2 border-background">
                                    <div className='flex justify-center gap-4'>
                                        <button
                                            onClick={() => handleUpdateClick(hour)}
                                            className="text-yellow-500 hover:text-yellow-600 text-[24px] md:text-[36px]"
                                        >
                                            <MdEdit  />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hour.id)}
                                            className="text-red-500 hover:text-red-600 text-[24px] md:text-[36px]"
                                        >
                                            <MdDelete  />
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedHour && (
                <FormUpdate
                    hour={selectedHour}
                    onClose={handleClose}
                    onUpdate={handleUpdate}
                />
            )}
            {isCreateOpen && (
                <FormCreate
                    onClose={handleClose}
                    onCreate={handleCreate}
                />
            )}
        </main>
    );
}