"use client"
import React, { useEffect, useState } from 'react';
import FormCreate from '@/components/api/services/FormCreate';
import FormUpdate from '@/components/api/services/FormUpdate'; // Assurez-vous que le chemin vers FormUpdate est correct
import Service from '@/models/service';
import NekoToast from '@/components/ui/_partial/Toast';
import { MdDelete, MdEdit } from 'react-icons/md';

export default function ServicesManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false); // État pour contrôler l'affichage de la modal de création
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false); // État pour contrôler l'affichage du formulaire de mise à jour
    const [selectedService, setSelectedService] = useState<Service | null>(null); // État pour stocker le service sélectionné pour la modification
    const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);
    // Fonction pour récupérer les services depuis l'API
    const fetchServices = async (additionalParam: string | number) => {
        try {
            const response = await fetch(`/api/services/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`)
            const data = await response.json();
            if (data.success) {
                setServices(data.services);
            } else {
                setError(data.message || 'Failed to fetch services');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('An error occurred while fetching services');
        } finally {
            setLoading(false);
        }
    };

    // Appeler fetchServices une seule fois au chargement du composant
    useEffect(() => {
        fetchServices('services');
    }, []);

    // Fonction pour supprimer un service
    const handleDeleteService = async (id: number) => {
        try {
            const response = await fetch(`/api/services/delete?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setServices(services.filter(service => service.id !== id));
            } else {
                console.error('Error deleting service:', data.message);
            }
            showToast('Delete', 'Service effacé avec succès.' );
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    // Fonction pour gérer la réussite de la création d'un service
    const handleServiceCreated = async () => {
        await fetchServices('services'); // Rafraîchir la liste des services après création
        setShowForm(false); // Fermer la modal après création
        showToast('Success', 'Service créer avec succès.' );
    };

    // Fonction pour gérer la réussite de la mise à jour d'un service
    const handleServiceUpdated = async () => {
        await fetchServices('services'); // Rafraîchir la liste des services après mise à jour
        setShowUpdateForm(false); // Fermer le formulaire de mise à jour après succès
        showToast('Update', 'Service mis à jour avec succès.' );
    };

    // Fonction pour ouvrir le formulaire de création
    const openCreateForm = () => {
        setShowForm(true);
    };

    // Fonction pour ouvrir le formulaire de mise à jour
    const openUpdateForm = (service: Service) => {
        setSelectedService(service); // Définir le service sélectionné pour la modification
        setShowUpdateForm(true); // Afficher le formulaire de mise à jour
    };

    // Si le chargement est en cours, afficher un message de chargement
    if (loading) {
        return <p>Loading...</p>;
    }

    // Si une erreur s'est produite, afficher un message d'erreur
    if (error) {
        return <p>Error: {error}</p>;
    }
   
    
    const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
        setToast({ type, message });
        setTimeout(() => {
          setToast(null);
        }, 3000); // Masquer le toast après 3 secondes
      };
        
          
    // Rendu du composant principal
    return (
        <main className='flex flex-col items-center py-12'>
        {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)} />}    
            <h1 className='text-2xl mb-6 font-bold'>Gestionnaire Services</h1>
            <button
                onClick={openCreateForm}
                className='bg-foreground hover:bg-muted-foreground hover:text-white text-secondary py-1 px-3 rounded-md mb-6'>
                Ajouter un Service
            </button>
            <div className="overflow-x-auto w-full flex flex-col items-center">
                <table className='shadow-md'>
                    <thead className='bg-muted-foreground'>
                        <tr className='w-full flex'>
                            <th className='w-1/4 py-3 px-6 text-left'>Name</th>
                            <th className='w-2/4 py-3 px-6 text-left'>Description</th>
                            <th className='w-1/4 py-3 px-6 text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className='bg-muted hover:bg-background flex flex-row w-full'>
                                <td className='w-1/4 py-3 px-6 border-b-2 border-background'>{service.name}</td>
                                <td className='w-2/4 py-3 px-6 border-b-2 border-background'>{service.description}</td>
                                <td className='w-1/4 py-3 px-6 border-b-2 border-background'>
                                    <div className='text-center flex justify-center gap-4'>
                                        <button
                                            className='text-red-500 hover:text-red-600'
                                            onClick={() => handleDeleteService(service.id)}
                                        >
                                            <MdDelete size={24} />
                                        </button>
                                        <button
                                            className='text-yellow-500 hover:text-yellow-600'
                                            onClick={() => openUpdateForm(service)}
                                        >
                                            
                                            <MdEdit size={24} />
                                        </button>                                        
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* Afficher le formulaire de création */}
            {showForm && (
                <FormCreate
                    onCreateSuccess={handleServiceCreated}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Afficher le formulaire de mise à jour */}
            {showUpdateForm && selectedService && (
                <FormUpdate
                    service={selectedService}
                    onUpdateSuccess={handleServiceUpdated}
                    onClose={() => setShowUpdateForm(false)}
                />
            )}
        </main>
    );
}