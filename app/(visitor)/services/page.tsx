"use client"
import React, { useEffect, useState } from 'react';

interface Service {
    id: number;
    name: string;
    description: string;
}

interface ModalProps {
    service: Service | null;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ service, onClose }) => {
    if (!service) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg'>
                <p className='text-xl font-bold mb-2'>{service.name}</p>
                <p className='text-md'>{service.description}</p>
                <button className='bg-red-500 text-white px-4 py-2 mt-4 rounded-md' onClick={onClose}>
                    Fermer
                </button>
            </div>
        </div>
    );
};

const ServicePage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/services/read');
                if (!response.ok) {
                    throw new Error('Echec de la synchronisation des services');
                }

                const { success, services } = await response.json();
                if (success) {
                    setServices(services);
                } else {
                    console.error('Service non trouvé');
                }
            } catch (error) {
                console.error('Erreur dans la synchronisation des services:', error);
            }
        };

        fetchServices();
    }, []);

    const openModal = (service: Service) => {
        setSelectedService(service);
    };

    const closeModal = () => {
        setSelectedService(null);
    };

    return (
        <main className='flex flex-col items-center p-12'>
            <h2 className='text-4xl font-bold mb-12'>-- SERVICES --</h2>
            <section>
                <div className='flex flex-wrap gap-6'>
                    {services.map((service) => (
                        <div key={service.id} className='border-2 border-slate-200 p-2 rounded-md max-w-[250px] cursor-pointer' onClick={() => openModal(service)}>
                            <p className='text-xl font-bold mb-2'>{service.name}</p>
                            <p className='text-md'>{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <Modal service={selectedService} onClose={closeModal} />
        </main>
    );
};

export default ServicePage;