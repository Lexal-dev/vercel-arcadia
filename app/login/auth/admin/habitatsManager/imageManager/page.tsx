"use client"
import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/images/uploaderImages'; // Assurez-vous que le chemin d'accès est correct
import Image from 'next/image';
import { storage } from '@/lib/firebaseConfig';
import { ref, deleteObject } from 'firebase/storage';
import { useRouter } from 'next/navigation'; // Utilisation de useRouter au lieu de next/navigation
import { MdEdit } from 'react-icons/md';
import NekoToast from '@/components/ui/_partial/Toast';

interface Habitat {
    id: number;
    name: string;
    description: string;
    comment: string;
    imageUrl: string[];
}


export default function ImageManager() {
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);

    // Fonction pour vérifier si l'URL est valide pour next/image
    function isValidUrl(url: string) {
        return url.includes('firebasestorage.googleapis.com');
    }

    // Fonction pour récupérer les habitats depuis l'API
    const fetchHabitats = async (additionalParam?: string | number) => {
        try {
            // Si additionalParam est undefined, vous pouvez choisir de le traiter différemment
            const param = additionalParam ?? ''; // Valeur par défaut ou logique alternative
            const response = await fetch(`/api/habitats/read?additionalParam=${encodeURIComponent(param.toString())}`);
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

    // Fonction pour supprimer une URL d'image d'un habitat
    const deleteImageUrl = async (habitatId: number, index: number, imageUrlToDelete: string) => {
        try {
            const habitatToUpdate = habitats.find(hab => hab.id === habitatId);
            if (!habitatToUpdate) {
                setError('Habitat not found');
                return;
            }
    
            const updatedUrls = [...habitatToUpdate.imageUrl];
            updatedUrls.splice(index, 1); // Supprimer l'élément à l'index spécifié
    
            // Supprimer l'image du stockage Firebase
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
                showToast('Delete', 'Image url et image effacé.' );
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

    // Effet pour récupérer les habitats initiaux
    useEffect(() => {
        fetchHabitats("true");
    }, []);

    // Ouvrir le modal pour gérer les images de l'habitat sélectionné
    const openModal = (habitat: Habitat) => {
        setSelectedHabitat(habitat);
        setIsModalOpen(true);
    };

    // Fermer le modal de gestion des images de l'habitat
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedHabitat(null);
        router.push("/login/auth/admin/habitatsManager/imageManager"); // Redirection après fermeture
    };

    // Fonction appelée après la mise à jour d'un habitat
    const handleHabitatUpdate = (updatedHabitat: Habitat) => {
        const updatedHabitats = habitats.map(hab => {
            if (hab.id === updatedHabitat.id) {
                return updatedHabitat;
            }
            return hab;
        });
        showToast('Success', 'Image et Image Url bien ajouté.' );
        setHabitats(updatedHabitats);
    };

    // Affichage en cours de chargement
    if (loading) {
        return <p>Loading...</p>;
    }

    // Affichage en cas d'erreur
    if (error) {
        return <p>Error: {error}</p>;
    }

    const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
        setToast({ type, message });
        setTimeout(() => {
          setToast(null);
        }, 3000); // Masquer le toast après 3 secondes
      };
    return (
        <main className='flex flex-col items-center p-12'>
            {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)} />}
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
                                        <button onClick={() => openModal(habitat)} className="text-yellow-500 hover:text-yellow-600 text-[24px] md:text-[36px]">
                                            <MdEdit  />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal pour gérer les images de l'habitat sélectionné */}
            {isModalOpen && selectedHabitat && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="flex flex-col justify-between modal-content min-w-[1000px] min-h-[500px] bg-white text-black p-8 rounded-lg shadow-lg">
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className="w-full text-4xl font-bold text-center">Images {selectedHabitat.name}</h2>
                            <span className="cursor-pointer text-4xl hover:text-red-500" onClick={closeModal}>&times;</span>
                        </div>
                        
                        <div className='flex flex-col md:flex-row w-full'>
                            <ul className='flex flex-wrap items-start justify-start'>
                                {/* Affichage des images de l'habitat */}
                                {selectedHabitat.imageUrl && selectedHabitat.imageUrl.map((url, index) => (
                                    <li key={index} className=' p-2' onClick={() => handleImageClick(url)}>
                                        {isValidUrl(url) ? (
                                            <div className='w-full flex flex-col'>
                                                <Image src={url} width={200}  height={200} alt={`Image ${index}`} />
                                                <div className='flex flex-col justify-between items-start'>
                                                    <button onClick={() => deleteImageUrl(selectedHabitat.id, index, url)} className="w-full text-white border-t-2 border-green-100 bg-red-500 bg:text-red-700">
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
                                {!selectedHabitat.imageUrl && (
                                    <li>Aucune URL d&apos;image disponible</li>
                                )}
                            </ul>
                        </div>
                        
                        <div className='flex flex-col items-center'>
                            {/* Composant ImageUploader pour télécharger de nouvelles images */}
                            <ImageUploader
                                folderName="habitats"
                                selectedItem={selectedHabitat} // Passer l'habitat sélectionné
                                onClose={closeModal}
                                onUpdate={handleHabitatUpdate}
                                fieldToUpdate="imageUrl" // Champ à mettre à jour dans l'habitat (imageUrl)
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}