"use client"
import React, { useEffect, useState } from 'react';
import FormCreate from '@/components/api/services/FormCreate';
import FormUpdate from '@/components/api/services/FormUpdate'; // Assurez-vous que le chemin vers FormUpdate est correct
import Service from '@/models/service';

export default function ServicesManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false); // État pour contrôler l'affichage de la modal de création
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false); // État pour contrôler l'affichage du formulaire de mise à jour
    const [selectedService, setSelectedService] = useState<Service | null>(null); // État pour stocker le service sélectionné pour la modification

    // Fonction pour récupérer les services depuis l'API
    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services/read');
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
        fetchServices();
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
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    // Fonction pour gérer la réussite de la création d'un service
    const handleServiceCreated = async () => {
        await fetchServices(); // Rafraîchir la liste des services après création
        setShowForm(false); // Fermer la modal après création
    };

    // Fonction pour gérer la réussite de la mise à jour d'un service
    const handleServiceUpdated = async () => {
        await fetchServices(); // Rafraîchir la liste des services après mise à jour
        setShowUpdateForm(false); // Fermer le formulaire de mise à jour après succès
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

    // Rendu du composant principal
    return (
        <main className='flex flex-col items-center p-12'>
            <h1 className='text-2xl mb-4 font-bold'>Service Management</h1>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className='min-w-full bg-white text-black shadow-md rounded-lg'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='py-3 px-6 border-b text-left'>ID</th>
                            <th className='py-3 px-6 border-b text-left'>Name</th>
                            <th className='py-3 px-6 border-b text-left'>Description</th>
                            <th className='py-3 px-6 border-b text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className='even:bg-gray-100'>
                                <td className='py-3 px-6 border-b'>{service.id}</td>
                                <td className='py-3 px-6 border-b'>{service.name}</td>
                                <td className='py-3 px-6 border-b'>{service.description}</td>
                                <td className='py-3 px-6 border-b text-center flex justify-center'>
                                    <button
                                        className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded mx-1 w-1/2'
                                        onClick={() => handleDeleteService(service.id)}
                                    >
                                        Supprimer
                                    </button>
                                    <button
                                        className='bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mx-1 w-1/2'
                                        onClick={() => openUpdateForm(service)}
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={openCreateForm}
                className='bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md mt-4'>
                Ajouter un Service
            </button>

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