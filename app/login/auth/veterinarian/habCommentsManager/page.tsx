"use client"
import React, { useState, useEffect } from 'react';
import FormUpdate from '@/components/api/habitats/FormUpdateComments';
import Habitat from '@/models/habitat';
import NekoToast from '@/components/ui/_partial/Toast';
import { MdEdit } from 'react-icons/md';

const HabitatsComments: React.FC = () => {
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);
    const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null); 

    const fetchHabitats = async (additionalParam: string | number) => {
        try {
            const response = await fetch(`/api/habitats/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`);
            const data = await response.json();
            if (data.success) {
                setHabitats(data.habitats);
            } else {
                setError(data.message || 'Failed to fetch habitats');
            }
        } catch (error) {
            console.error('Error fetching habitats:', error);
            setError('An error occurred while fetching habitats');
        } finally {
            setLoading(false);
        }
    };

    const openUpdateForm = (habitat: Habitat) => {
        setSelectedHabitat(habitat);
    };

    const closeUpdateForm = () => {
        setSelectedHabitat(null);
    };

    useEffect(() => {
        fetchHabitats('defaultParam');
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main className='flex flex-col items-center px-1 py-12'>
            {toast && (
                <NekoToast 
                    toastType={toast.type} 
                    toastMessage={toast.message} 
                    timeSecond={3} 
                    onClose={() => setToast(null)}
                />
            )}
            <h1 className='text-2xl mb-4 font-bold'>Habitats Management</h1>
            <div className="w-full lg:w-2/3 overflow-x-auto shadow-md md:rounded-lg">
                <table className='w-full table-auto'>
                    <thead>
                        <tr className='bg-muted-foreground text-white'>
                            <th className='px-4 py-2 text-center'>Name</th>
                            <th className='px-4 py-2 text-center'>Description</th>
                            <th className='px-4 py-2 text-center'>Comment</th>
                            <th className='px-4 py-2 text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habitats.map((habitat) => (
                            <tr key={habitat.id} className='border-t bg-foreground text-secondary hover:bg-muted hover:text-white'>
                                <td className='px-4 py-2'>{habitat.name}</td>
                                <td className='px-4 py-2'>{habitat.description}</td>
                                <td className='px-4 py-2'>{habitat.comment}</td>
                                <td className='w-full min-h-[100px] flex flex-col justify-center items-center'>
                                    <button
                                        className='text-yellow-500 hover:text-yellow-700'
                                        onClick={() => openUpdateForm(habitat)}
                                    >
                                        <MdEdit size={32} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FormUpdate component */}
            {selectedHabitat && (
                <FormUpdate
                    habitat={selectedHabitat}
                    onUpdateSuccess={() => {
                        setToast({ type: 'Success', message: `Commentaire sur l'habitat [${selectedHabitat.name}] modifié.` });
                        fetchHabitats('defaultParam');
                        closeUpdateForm(); 
                    }}
                    onClose={closeUpdateForm}
                />
            )}
        </main>
    );
}

export default HabitatsComments;