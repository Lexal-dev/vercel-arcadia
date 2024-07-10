"use client";
import React, { useState, useEffect } from 'react';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebaseConfig';
import FormCreate from '@/components/api/habitats/FormCreate';
import FormUpdate from '@/components/api/habitats/FormUpdate';
import Habitat from '@/models/habitat';
import NekoToast from '@/components/ui/_partial/Toast';
import { MdDelete, MdEdit } from 'react-icons/md';

const HabitatsManager: React.FC = () => {
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false); 
    const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null);
    const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);

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

    const openCreateForm = () => {
        setShowForm(true);
    };

    const openUpdateForm = (habitat: Habitat) => {
        setSelectedHabitat(habitat);
    };

    const handleCreateSuccess = async () => {
        await fetchHabitats("true"); 
        setShowForm(false); 
        showToast('Success', 'Habitat crée avec succès');
    };

    const closeUpdateForm = () => {
        setSelectedHabitat(null);
    };

    useEffect(() => {
        fetchHabitats('true');
    }, []);

    const handleDeleteHabitat = async (id: number) => {
        const habitatToDelete = habitats.find(habitat => habitat.id === id);
        const habitatToDeleteUrl = habitatToDelete?.imageUrl;
        if (!habitatToDelete) {
            console.error('Habitat not found for deletion:', id);
            return;
        }

        try {
            if (habitatToDeleteUrl && habitatToDeleteUrl.length > 0) {
                for (const imageUrl of habitatToDeleteUrl) {
                    await deleteImageFromStorage(imageUrl);
                }
            }
        } catch (error) {
            console.error('Error deleting images from storage:', error);
            return; 
        }

        try {
            const response = await fetch(`/api/habitats/delete?id=${encodeURIComponent(id.toString())}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setHabitats(habitats.filter(habitat => habitat.id !== id));
                showToast('Delete', 'Habitat effacé avec succès');
            } else {
                console.error('Error deleting habitat:', data.message);
            }
        } catch (error) {
            console.error('Error deleting habitat:', error);
        }
    };

    const deleteImageFromStorage = async (imageUrlToDelete: string) => {
        try {
            const storageRef = ref(storage, imageUrlToDelete);
            await deleteObject(storageRef);
            console.log('Successfully deleted image from storage:', imageUrlToDelete);
        } catch (error) {
            console.error('Error deleting image from storage:', error);
            throw new Error('Failed to delete image from storage');
        }
    };

    const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
        setToast({ type, message });
        setTimeout(() => {
          setToast(null);
        }, 3000);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main className='flex flex-col items-center py-12'>
            {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)} />}

            <button onClick={openCreateForm} className='bg-foreground hover:bg-muted-foreground hover:text-white text-secondary py-1 px-3 rounded-md mb-6'>
                Ajouter un habitat
            </button>
            <h1 className='text-2xl mb-4 font-bold'>Habitats Management</h1>
            <div className="overflow-x-auto w-full flex flex-col items-center">
                <table className='w-full md:w-2/3 shadow-md'>
                    <thead className='bg-muted-foreground'>
                        <tr>
                            <th className='py-3 px-2 text-left'>Name</th>
                            <th className='py-3 px-2 text-left'>Description</th>
                            <th className='py-3 px-2 text-left'>Comment</th>
                            <th className='py-3 px-2 text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habitats.map((habitat) => (
                            <tr key={habitat.id} className='bg-foreground text-secondary hover:bg-muted'>
                                <td className='py-3 px-2 border-b-2 border-background'>{habitat.name}</td>
                                <td className='py-3 px-2 border-b-2 border-background'>{habitat.description}</td>
                                <td className='py-3 px-2 border-b-2 border-background'>{habitat.comment}</td>
                                <td className='py-3 px-2 border-b-2 border-background'>
                                    <div className='flex justify-center gap-4'>
                                        <button
                                            onClick={() => openUpdateForm(habitat)}
                                            className="text-yellow-500 hover:text-yellow-600 text-[24px] md:text-[36px]"
                                        >
                                            <MdEdit  />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHabitat(habitat.id)}
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

            {showForm && (
                <FormCreate
                    onCreateSuccess={handleCreateSuccess}
                    onClose={() => setShowForm(false)}
                />
            )}

            {selectedHabitat && (
                <FormUpdate
                    habitat={selectedHabitat}
                    onUpdateSuccess={() => {
                        fetchHabitats('true'); 
                        closeUpdateForm(); 
                        showToast('Update', 'Habitat modifié avec succès');
                    }}
                    onClose={closeUpdateForm}
                />
            )}
        </main>
    );
}

export default HabitatsManager;