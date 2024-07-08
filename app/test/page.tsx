"use client"
import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/images/uploaderImages';
import Image from 'next/image';
import { storage } from '@/lib/firebaseConfig';
import { ref, deleteObject } from 'firebase/storage';
import { useRouter } from 'next/navigation';

interface Habitat {
    id: number;
    name: string;
    description: string;
    comment: string;
    imageUrl: string[];
}

const Test: React.FC = () => {
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const router = useRouter();

    // Function to check if URL is valid for next/image
    function isValidUrl(url: string) {
        return url.includes('firebasestorage.googleapis.com');
    }

    // Function to fetch habitats from API
    const fetchHabitats = async () => {
        try {
            const response = await fetch('/api/habitats/read');
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

    const deleteImageUrl = async (habitatId: number, index: number, imageUrlToDelete: string) => {
        try {
            const habitatToUpdate = habitats.find(hab => hab.id === habitatId);
            if (!habitatToUpdate) {
                setError('Habitat not found');
                return;
            }
    
            const updatedUrls = [...habitatToUpdate.imageUrl];
            updatedUrls.splice(index, 1); // Remove the element at the specified index
    
            // Delete image from Firebase Storage
            await deleteImageFromStorage(imageUrlToDelete);
    
            const response = await fetch('/api/habitats/updateUrl', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: habitatId, imageUrl: updatedUrls })
            });
    
            const data = await response.json();
            if (data.message) {
                const updatedHabitats = habitats.map(hab => {
                    if (hab.id === habitatId) {
                        return {
                            ...hab,
                            imageUrl: updatedUrls
                        };
                    }
                    return hab;
                });
    
                setHabitats(updatedHabitats);
                closeModal();
            } else {
                setError(data.error || 'Failed to delete imageUrl');
            }
        } catch (error) {
            console.error('Error deleting imageUrl:', error);
            setError('An error occurred while deleting imageUrl');
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

    const handleImageClick = (clickedUrl: string) => {
        console.log('Clicked Image URL:', clickedUrl);
    };

    useEffect(() => {
        fetchHabitats();
    }, []);

    const openModal = (habitat: Habitat) => {
        setSelectedHabitat(habitat);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedHabitat(null);
        router.push("/test");
    };

    const handleHabitatUpdate = (updatedHabitat: Habitat) => {
        const updatedHabitats = habitats.map(hab => {
            if (hab.id === updatedHabitat.id) {
                return updatedHabitat;
            }
            return hab;
        });
        setHabitats(updatedHabitats);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main className='flex flex-col items-center p-12'>
            <h1 className='text-2xl mb-4 font-bold'>Habitats Management</h1>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className='min-w-full bg-white text-black shadow-md rounded-lg'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='py-3 px-6 border-b text-left'>ID</th>
                            <th className='py-3 px-6 border-b text-left'>Name</th>
                            <th className='py-3 px-6 border-b text-left'>Description</th>
                            <th className='py-3 px-6 border-b text-left'>Comment</th>
                            <th className='py-3 px-6 border-b text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habitats.map((habitat) => (
                            <tr key={habitat.id} className='even:bg-gray-100'>
                                <td className='py-3 px-6 border-b'>{habitat.id}</td>
                                <td className='py-3 px-6 border-b'>{habitat.name}</td>
                                <td className='py-3 px-6 border-b'>{habitat.description}</td>
                                <td className='py-3 px-6 border-b'>{habitat.comment}</td>
                                <td className='py-3 px-6 border-b text-center flex justify-center'>
                                    <button
                                        onClick={() => openModal(habitat)}
                                        className='mr-2 text-blue-500'
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedHabitat && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="flex flex-col justify-between modal-content min-w-[1000px] min-h-[500px] bg-white text-black p-8 rounded-lg shadow-lg">
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className="w-full text-4xl font-bold text-center">URL -&gt; {selectedHabitat.name}</h2>
                            <span className="cursor-pointer text-4xl hover:text-red-500" onClick={closeModal}>&times;</span>
                        </div>
                        <div className='flex'>
                            <div className='flex flex-col w-1/2 w-full items-center'>
                                <h3 className="font-bold mb-2">URL existant -&gt;</h3>
                                <ul className="list-disc pl-4">
                                    {selectedHabitat.imageUrl && selectedHabitat.imageUrl.map((url, index) => (
                                        <li key={index}>
                                            {url}
                                            <button onClick={() => deleteImageUrl(selectedHabitat.id, index, url)} className="ml-2 text-red-500 hover:text-red-700">
                                                Supprimer
                                            </button>
                                        </li>
                                    ))}
                                    {!selectedHabitat.imageUrl && (
                                        <li>Aucune URL d&apos;image disponible</li>
                                    )}
                                </ul>
                            </div>

                            <div className='flex flex-col w-1/2 w-full items-center'>
                                <h3 className="font-bold mb-2">Image(s) -&gt;</h3>
                                <ul className='flex flex-wrap max-w-[405px]'>
                                    {selectedHabitat.imageUrl && selectedHabitat.imageUrl.map((url, index) => (
                                        <li key={index} className='w-1/2 w-[200px] p-2' onClick={() => handleImageClick(url)}>
                                            {isValidUrl(url) ? (
                                                <Image src={url} width={200} height={200} alt={`${selectedHabitat.name}${index}`} />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded">
                                                    Image not available
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                    {!selectedHabitat.imageUrl && (
                                        <li>Aucune URL d&apos;image disponible</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className='flex flex-col items-center'>
                            <h3>{selectedHabitat.name} : {selectedHabitat.id}</h3>
                            <ImageUploader
                                folderName="habitats"
                                selectedHabitat={selectedHabitat}
                                onClose={closeModal}
                                onUpdate={handleHabitatUpdate}
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Test;