"use client"
import React, { useEffect, useState } from 'react';
import Hour from '@/models/hour';
import FormUpdate from '@/components/api/hours/FormUpdate'; // Correct import
import FormCreate from '@/components/api/hours/FormCreate'; // Correct import

export default function HoursManager() {
    const [hours, setHours] = useState<Hour[]>([]);
    const [selectedHour, setSelectedHour] = useState<Hour | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        fetch('/api/hours/read', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setHours(data.hours);
                } else {
                    console.error('Failed to fetch hours:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching hours:', error);
            });
    }, []);

    const handleUpdateClick = (hour: Hour) => {
        setSelectedHour(hour);
    };

    const handleUpdate = (updatedHour: Hour) => {
        setHours(hours.map(hour => hour.id === updatedHour.id ? updatedHour : hour));
    };

    const handleCreateClick = () => {
        setIsCreateOpen(true);
    };

    const handleCreate = (newHour: Hour) => {
        setHours([...hours, newHour]);
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
        } catch (error) {
            console.error('Error deleting hour:', error);
        }
    };

    return (
        <main className="flex flex-col container mx-auto p-4 items-center">
            <button
                onClick={handleCreateClick}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Ajouter un horaire
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-gray-200 shadow-md rounded text-black">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4 border-r">ID</th>
                            <th className="py-2 px-4 border-r">Jours</th>
                            <th className="py-2 px-4 border-r">Ouverture</th>
                            <th className="py-2 px-4 border-r">Fermeture</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map(hour => (
                            <tr key={hour.id} className="border-b hover:bg-gray-50 text-center">
                                <td className="py-2 px-4 border-r">{hour.id}</td>
                                <td className="py-2 px-4 border-r">{hour.days}</td>
                                <td className="py-2 px-4 border-r">{hour.open}</td>
                                <td className="py-2 px-4 border-r">{hour.close}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleUpdateClick(hour)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Mettre à jour
                                    </button>
                                    <button
                                        onClick={() => handleDelete(hour.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Supprimer
                                    </button>
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