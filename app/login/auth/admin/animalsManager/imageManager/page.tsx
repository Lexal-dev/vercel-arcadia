"use client"
import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/images/uploaderImages'; // Assurez-vous que le chemin d'accès est correct
import Image from 'next/image';
import { storage } from '@/lib/firebaseConfig';
import { ref, deleteObject } from 'firebase/storage';
import { useRouter } from 'next/navigation'; // Utilisation de useRouter au lieu de next/navigation

interface Animal {
    id: number;
    name: string;
    etat: string;
    imageUrl: string[]; // Assurez-vous que imageUrl est toujours un tableau de chaînes
    // Autres propriétés de votre modèle Animal
}
export default function ImageManager() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    // Fonction pour vérifier si l'URL est valide pour next/image
    function isValidUrl(url: string) {
        return url.includes('firebasestorage.googleapis.com');
    }

    // Fonction pour récupérer les animaux depuis l'API
    const fetchAnimals = async (additionalParam: string | number) => {
        try {
            const response = await fetch(`/api/animals/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`);
            const data = await response.json();
            if (data.success) {
                setAnimals(data.animals);
            } else {
                setError(data.message || 'Failed to fetch animals');
            }
        } catch (error) {
            console.error('Error fetching animals:', error);
            setError('An error occurred while fetching animals');
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer une URL d'image d'un animal
    const deleteImageUrl = async (animalId: number, index: number, imageUrlToDelete: string) => {
        try {
            const animalToUpdate = animals.find(animal => animal.id === animalId);
            if (!animalToUpdate) {
                setError('Animal not found');
                return;
            }
    
            const updatedUrls = [...animalToUpdate.imageUrl];
            updatedUrls.splice(index, 1); // Supprimer l'élément à l'index spécifié
    
            // Supprimer l'image du stockage Firebase
            await deleteImageFromStorage(imageUrlToDelete);
    
            const response = await fetch('/api/animals/updateUrl', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: animalId, imageUrl: updatedUrls })
            });
    
            const data = await response.json();
            if (data.message) {
                const updatedAnimals = animals.map(animal => {
                    if (animal.id === animalId) {
                        return {
                            ...animal,
                            imageUrl: updatedUrls
                        };
                    }
                    return animal;
                });
    
                setAnimals(updatedAnimals);
                closeModal();
            } else {
                setError(data.error || 'Failed to delete imageUrl');
            }
        } catch (error) {
            console.error('Error deleting imageUrl:', error);
            setError('An error occurred while deleting imageUrl');
        }
    };

    // Fonction pour supprimer une image du stockage Firebase
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

    // Gestion du clic sur une image (actuellement juste console.log)
    const handleImageClick = (clickedUrl: string) => {
        console.log('Clicked Image URL:', clickedUrl);
    };

    // Effet pour récupérer les animaux initiaux
    useEffect(() => {
        fetchAnimals('animals');
    }, []);

    // Ouvrir le modal pour gérer les images de l'animal sélectionné
    const openModal = (animal: Animal) => {
        setSelectedAnimal(animal);
        setIsModalOpen(true);
    };

    // Fermer le modal de gestion des images de l'animal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAnimal(null);
        router.push("/login/auth/admin/animalsManager/imageManager"); // Redirection après fermeture
    };

    // Fonction appelée après la mise à jour d'un animal
    const handleAnimalUpdate = (updatedAnimal: Animal) => {
        const updatedAnimals = animals.map(animal => {
            if (animal.id === updatedAnimal.id) {
                return updatedAnimal;
            }
            return animal;
        });
        setAnimals(updatedAnimals);
    };

    // Affichage en cours de chargement
    if (loading) {
        return <p>Loading...</p>;
    }

    // Affichage en cas d'erreur
    if (error) {
        return <p>Error: {error}</p>;
    }

    // Rendu principal de la page
    return (
        <main className='flex flex-col items-center p-12'>
            <h1 className='text-2xl mb-4 font-bold'>Animals Management</h1>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className='min-w-full bg-white text-black shadow-md rounded-lg'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='py-3 px-6 border-b text-left'>ID</th>
                            <th className='py-3 px-6 border-b text-left'>Name</th>
                            <th className='py-3 px-6 border-b text-left'>State</th>
                            <th className='py-3 px-6 border-b text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animals.map((animal) => (
                            <tr key={animal.id} className='even:bg-gray-100'>
                                <td className='py-3 px-6 border-b'>{animal.id}</td>
                                <td className='py-3 px-6 border-b'>{animal.name}</td>
                                <td className='py-3 px-6 border-b'>{animal.etat}</td>
                                <td className='py-3 px-6 border-b text-center flex justify-center'>
                                    <button
                                        onClick={() => openModal(animal)}
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

            {/* Modal pour gérer les images de l'animal sélectionné */}
            {isModalOpen && selectedAnimal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="flex flex-col justify-between modal-content min-w-[1000px] min-h-[500px] bg-white text-black p-8 rounded-lg shadow-lg">
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className="w-full text-4xl font-bold text-center">Images - {selectedAnimal.name}</h2>
                            <span className="cursor-pointer text-4xl hover:text-red-500" onClick={closeModal}>&times;</span>
                        </div>
                        
                        <div className='flex flex-col w-full items-around'>
                            <ul className='flex flex-wrap items-start justify-start'>
                                {/* Affichage des images de l'animal */}
                                {selectedAnimal.imageUrl && selectedAnimal.imageUrl.map((url, index) => (
                                    <li key={index} className=' p-2' onClick={() => handleImageClick(url)}>
                                        {isValidUrl(url) ? (
                                            <div className='w-full flex gap-3'>
                                                <Image src={url} width={200}  height={200} alt={`Image ${index}`} />
                                                <div className='flex flex-col justify-between items-start'>
                                                    <small>{url}</small>
                                                    {/* Bouton pour supprimer une image */}
                                                    <button onClick={() => deleteImageUrl(selectedAnimal.id, index, url)} className="ml-2 text-red-500 hover:text-red-700">
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded">
                                                Image not available
                                            </div>
                                        )}
                                    </li>
                                ))}
                                {!selectedAnimal.imageUrl && (
                                    <li>Aucune URL d&apos;image disponible</li>
                                )}
                            </ul>
                        </div>
                        
                        <div className='flex flex-col items-center'>
                            {/* Composant ImageUploader pour télécharger de nouvelles images */}
                            <ImageUploader
                                folderName="animals"
                                selectedItem={selectedAnimal} // Passer l'animal sélectionné
                                onClose={closeModal}
                                onUpdate={handleAnimalUpdate}
                                fieldToUpdate="imageUrl" // Champ à mettre à jour dans l'animal (imageUrl)
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}