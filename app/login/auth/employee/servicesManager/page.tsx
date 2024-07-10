"use client";
import React, { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import FormUpdate from '@/components/api/services/employeeFormUpdate';
import NekoToast from '@/components/ui/_partial/Toast';

interface Service {
  id: number;
  name: string;
  description: string;
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);

  const fetchServices = async (additionalParam: string | number) => {
    try {
      const response = await fetch(`/api/services/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      } else {
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (error:any) {
      console.error('Error fetching services:', error);
      showToast('Error', `Erreur lors de la récupération des services: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchServices('default'); // Replace 'default' with the actual parameter you need
  }, []);

  const handleEditService = (service: Service) => {
    setSelectedService(service);
  };

  const handleUpdateSuccess = () => {
    fetchServices('default'); // Replace 'default' with the actual parameter you need
    setSelectedService(null);
    showToast('Success', 'Service mis à jour avec succès.');
  };

  const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000); // Masquer le toast après 3 secondes
  };

  return (
    <main className="w-full flex-col flex py-12 px-2 items-center">
      {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)} />}

      <div className="lg:w-2/3 overflow-x-auto  shadow-md md:rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted-foreground text-white">
              <th className="w-1/5 px-4 py-2 text-left">Nom</th>
              <th className="w-3/5 px-4 py-2 text-left">Description</th>
              <th className="w-1/5 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-t bg-foreground text-secondary hover:bg-muted hover:text-white">
                <td className="w-1/5 px-4 py-2">{service.name}</td>
                <td className="w-3/5 px-4 py-2">{service.description}</td>
                <td className="w-full min-h-[100px] flex flex-col justify-center items-center">
                  <button onClick={() => handleEditService(service)} className="text-yellow-500 hover:text-yellow-700">
                    <MdEdit size={32} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedService && (
        <FormUpdate
          service={selectedService}
          onUpdateSuccess={handleUpdateSuccess}
          onClose={() => setSelectedService(null)}
        />
      )}
    </main>
  );
}